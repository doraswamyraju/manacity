import SwiftUI
import GoogleSignIn

class GoogleSignInManager: NSObject, ObservableObject {
    static let shared = GoogleSignInManager()

    private let clientID = "101383899067-du9bq7vrbo0jm02lv4ndtl5n1k4gml34.apps.googleusercontent.com"

    override init() {
        super.init()
        let config = GIDConfiguration(clientID: clientID)
        GIDSignIn.sharedInstance.configuration = config
    }

    func restorePreviousSignIn(completion: @escaping (Result<String, Error>) -> Void) {
        let config = GIDConfiguration(clientID: clientID)
        GIDSignIn.sharedInstance.configuration = config
        
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
        // 1. Try silent restoration from Keychain first
        restorePreviousSignIn { [weak self] result in
            if case .success(let idToken) = result {
                completion(.success(idToken))
                return
            }
            
            // 2. If no saved session exists, trigger interactive Google Sign In
            self?.performInteractiveSignIn(completion: completion)
        }
    }

    func switchAccount(completion: @escaping (Result<String, Error>) -> Void) {
        // Sign out current account from Keychain and run interactive picker for new account
        signOut()
        performInteractiveSignIn(completion: completion)
    }

    private func performInteractiveSignIn(completion: @escaping (Result<String, Error>) -> Void) {
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
