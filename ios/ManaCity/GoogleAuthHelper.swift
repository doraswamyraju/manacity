import SwiftUI
import WebKit

struct GoogleSignInWebSheet: UIViewControllerRepresentable {
    let url: URL
    var onCompletion: (String?, String?, String?) -> Void // (token, role, email)

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
        var onCompletion: ((String?, String?, String?) -> Void)?

        override func viewDidLoad() {
            super.viewDidLoad()
            view.backgroundColor = .systemBackground

            let config = WKWebViewConfiguration()
            webView = WKWebView(frame: view.bounds, configuration: config)
            webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            webView.navigationDelegate = self
            view.addSubview(webView)

            if let url = url {
                webView.load(URLRequest(url: url))
            }
        }

        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            if let urlString = navigationAction.request.url?.absoluteString {
                if urlString.contains("token=") {
                    let token = extractParam(from: urlString, param: "token")
                    let role = extractParam(from: urlString, param: "role")
                    let email = extractParam(from: urlString, param: "email")
                    
                    onCompletion?(token, role, email)
                    dismiss(animated: true)
                    decisionHandler(.cancel)
                    return
                }
            }
            decisionHandler(.allow)
        }

        private func extractParam(from urlString: String, param: String) -> String? {
            guard let components = URLComponents(string: urlString) else { return nil }
            if let val = components.queryItems?.first(where: { $0.name == param })?.value {
                return val
            }
            if let fragment = components.fragment {
                let items = fragment.components(separatedBy: "&")
                for item in items {
                    let pair = item.components(separatedBy: "=")
                    if pair.count == 2 && pair[0] == param {
                        return pair[1].removingPercentEncoding
                    }
                }
            }
            return nil
        }
    }
}
