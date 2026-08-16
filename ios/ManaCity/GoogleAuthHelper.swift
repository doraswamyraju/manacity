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

    class WebViewController: UIViewController, WKNavigationDelegate, ASWebAuthenticationPresentationContextProviding {
        var url: URL?
        var webView: WKWebView!
        var onCompletion: ((String?, String?) -> Void)?
        var authSession: ASWebAuthenticationSession?

        override func viewDidLoad() {
            super.viewDidLoad()
            view.backgroundColor = .systemBackground

            if let targetUrl = url {
                let callbackScheme = "https"
                authSession = ASWebAuthenticationSession(url: targetUrl, callbackURLScheme: callbackScheme) { callbackURL, error in
                    if let callbackURL = callbackURL {
                        let urlString = callbackURL.absoluteString
                        let token = self.extractQueryParam(from: urlString, param: "token") ?? self.extractQueryParam(from: urlString, param: "id_token")
                        let email = self.extractQueryParam(from: urlString, param: "email")
                        self.onCompletion?(token, email)
                    } else {
                        self.onCompletion?(nil, nil)
                    }
                    self.dismiss(animated: true)
                }
                authSession?.presentationContextProvider = self
                authSession?.prefersEphemeralWebBrowserSession = false
                authSession?.start()
            }

            webView = WKWebView(frame: view.bounds)
            webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            webView.navigationDelegate = self
            view.addSubview(webView)

            if let url = url {
                webView.load(URLRequest(url: url))
            }
        }

        func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
            return view.window ?? UIWindow()
        }

        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            if let url = navigationAction.request.url?.absoluteString {
                if url.contains("token=") || url.contains("id_token=") || url.contains("code=") {
                    let token = extractQueryParam(from: url, param: "token") ?? extractQueryParam(from: url, param: "id_token") ?? extractQueryParam(from: url, param: "code")
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

