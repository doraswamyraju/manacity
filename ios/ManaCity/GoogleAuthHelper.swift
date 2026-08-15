import SwiftUI
import AuthenticationServices
import WebKit

struct GoogleSignInWebSheet: UIViewControllerRepresentable {
    let url: URL
    var onCompletion: (String?, String?) -> Void // (idToken, email)

    func makeUIViewController(context: Context) -> WebViewController {
        let vc = WebViewController()
        vc.url = url
        vc.onCompletion = onCompletion
        return vc
    }

    func updateUIViewController(_ uiViewController: WebViewController, context: Context) {}

    class WebViewController: UIViewController, WKNavigationDelegate {
        var url: URL?
        var webView: WKWebView!
        var onCompletion: ((String?, String?) -> Void)?

        override func viewDidLoad() {
            super.viewDidLoad()
            webView = WKWebView(frame: view.bounds)
            webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            webView.navigationDelegate = self
            view.addSubview(webView)

            if let url = url {
                webView.load(URLRequest(url: url))
            }
        }

        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            if let url = navigationAction.request.url?.absoluteString {
                if url.contains("token=") || url.contains("id_token=") {
                    // Extract token from query params or URL hash
                    let token = extractQueryParam(from: url, param: "token") ?? extractQueryParam(from: url, param: "id_token")
                    let email = extractQueryParam(from: url, param: "email")
                    onCompletion?(token, email)
                    dismiss(animated: true)
                    decisionHandler(.cancel)
                    return
                }
            }
            decisionHandler(.allow)
        }

        private func extractQueryParam(from urlString: String, param: String) -> String? {
            guard let components = URLComponents(string: urlString) else { return nil }
            return components.queryItems?.first(where: { $0.name == param })?.value
        }
    }
}
