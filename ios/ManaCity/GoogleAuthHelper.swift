import SwiftUI
import AuthenticationServices

class GoogleSignInManager: NSObject, ASWebAuthenticationPresentationContextProviding {
    static let shared = GoogleSignInManager()
    
    private let clientID = "101383899067-du9bq7vrbo0jm02lv4ndtl5n1k4gml34.apps.googleusercontent.com"
    private let redirectURI = "com.googleusercontent.apps.101383899067-du9bq7vrbo0jm02lv4ndtl5n1k4gml34:/oauth2redirect"
    private let callbackScheme = "com.googleusercontent.apps.101383899067-du9bq7vrbo0jm02lv4ndtl5n1k4gml34"
    
    private var authSession: ASWebAuthenticationSession?
    
    func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let window = windowScene.windows.first(where: { $0.isKeyWindow }) {
            return window
        }
        return UIWindow()
    }
    
    func signIn(completion: @escaping (Result<String, Error>) -> Void) {
        let authURLString = "https://accounts.google.com/o/oauth2/v2/auth?client_id=\(clientID)&redirect_uri=\(redirectURI)&response_type=code&scope=openid%20email%20profile&prompt=select_account"
        
        guard let authURL = URL(string: authURLString) else {
            completion(.failure(NSError(domain: "GoogleAuth", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid Auth URL"])))
            return
        }
        
        authSession = ASWebAuthenticationSession(url: authURL, callbackURLScheme: callbackScheme) { [weak self] callbackURL, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let callbackURL = callbackURL,
                  let code = self?.extractQueryParam(from: callbackURL.absoluteString, param: "code") else {
                completion(.failure(NSError(domain: "GoogleAuth", code: -2, userInfo: [NSLocalizedDescriptionKey: "Failed to retrieve authorization code."])))
                return
            }
            
            // Exchange code for Google ID token
            self?.exchangeCodeForIDToken(code: code, completion: completion)
        }
        
        authSession?.presentationContextProvider = self
        authSession?.prefersEphemeralWebBrowserSession = false
        authSession?.start()
    }
    
    private func exchangeCodeForIDToken(code: String, completion: @escaping (Result<String, Error>) -> Void) {
        guard let tokenEndpoint = URL(string: "https://oauth2.googleapis.com/token") else { return }
        
        var request = URLRequest(url: tokenEndpoint)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        let bodyParameters = [
            "code": code,
            "client_id": clientID,
            "redirect_uri": redirectURI,
            "grant_type": "authorization_code"
        ]
        
        let bodyString = bodyParameters.map { "\($0.key)=\($0.value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? $0.value)" }.joined(separator: "&")
        request.httpBody = bodyString.data(using: .utf8)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                DispatchQueue.main.async { completion(.failure(error)) }
                return
            }
            
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                DispatchQueue.main.async {
                    completion(.failure(NSError(domain: "GoogleAuth", code: -3, userInfo: [NSLocalizedDescriptionKey: "Invalid token response from Google."])))
                }
                return
            }
            
            if let idToken = json["id_token"] as? String {
                DispatchQueue.main.async { completion(.success(idToken)) }
            } else if let errorDesc = json["error_description"] as? String {
                DispatchQueue.main.async {
                    completion(.failure(NSError(domain: "GoogleAuth", code: -4, userInfo: [NSLocalizedDescriptionKey: errorDesc])))
                }
            } else {
                DispatchQueue.main.async {
                    completion(.failure(NSError(domain: "GoogleAuth", code: -5, userInfo: [NSLocalizedDescriptionKey: "ID Token missing in Google response."])))
                }
            }
        }.resume()
    }
    
    private func extractQueryParam(from urlString: String, param: String) -> String? {
        guard let components = URLComponents(string: urlString) else { return nil }
        return components.queryItems?.first(where: { $0.name == param })?.value
    }
}
