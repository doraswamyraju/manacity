import SwiftUI
import GoogleSignIn

class GoogleSignInManager: ObservableObject {
    static let shared = GoogleSignInManager()

    private let clientID = "101383899067-du9bq7vrbo0jm02lv4ndtl5n1k4gml34.apps.googleusercontent.com"

    func restorePreviousSignIn(completion: @escaping (Result<String, Error>) -> Void) {
        GIDSignIn.sharedInstance.restorePreviousSignIn { user, error in
            if let user = user, let idToken = user.idToken?.tokenString {
                completion(.success(idToken))
            } else if let error = error {
                completion(.failure(error))
            } else {
                completion(.failure(NSError(domain: "GoogleAuth", code: -1, userInfo: [NSLocalizedDescriptionKey: "No previous Google session found"])))
            }
        }
    }

    func signIn(completion: @escaping (Result<String, Error>) -> Void) {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let rootViewController = windowScene.windows.first(where: { $0.isKeyWindow })?.rootViewController else {
            completion(.failure(NSError(domain: "GoogleAuth", code: -2, userInfo: [NSLocalizedDescriptionKey: "Could not find root view controller"])))
            return
        }

        let config = GIDConfiguration(clientID: clientID)
        GIDSignIn.sharedInstance.configuration = config

        GIDSignIn.sharedInstance.signIn(withPresenting: rootViewController) { result, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let user = result?.user,
                  let idToken = user.idToken?.tokenString else {
                completion(.failure(NSError(domain: "GoogleAuth", code: -3, userInfo: [NSLocalizedDescriptionKey: "Failed to obtain Google ID Token"])))
                return
            }

            completion(.success(idToken))
        }
    }

    func signOut() {
        GIDSignIn.sharedInstance.signOut()
    }
}
