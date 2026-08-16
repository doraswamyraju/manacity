import SwiftUI
import GoogleSignIn

enum AppScreen {
    case publicHome
    case login
    case register
    case adminDashboard
    case customerDashboard
    case superAdminConsole
}

struct ContentView: View {
    @State private var currentScreen: AppScreen = .publicHome

    var body: some View {
        Group {
            switch currentScreen {
            case .publicHome:
                PublicHomeView(
                    onSelectBusiness: { _ in },
                    onNavigateToLogin: { currentScreen = .login },
                    onNavigateToRegister: { currentScreen = .register }
                )

            case .login:
                LoginView(
                    onLoginSuccess: { role in
                        switch role.uppercased() {
                        case "SUPER_ADMIN": currentScreen = .superAdminConsole
                        case "CUSTOMER": currentScreen = .customerDashboard
                        default: currentScreen = .adminDashboard
                        }
                    },
                    onNavigateToRegister: { currentScreen = .register },
                    onNavigateToHome: { currentScreen = .publicHome }
                )

            case .register:
                RegisterView(
                    onRegisterSuccess: { role in
                        switch role.uppercased() {
                        case "SUPER_ADMIN": currentScreen = .superAdminConsole
                        case "CUSTOMER": currentScreen = .customerDashboard
                        default: currentScreen = .adminDashboard
                        }
                    },
                    onNavigateToLogin: { currentScreen = .login },
                    onNavigateToHome: { currentScreen = .publicHome }
                )

            case .adminDashboard:
                AdminDashboardView(
                    onLogout: {
                        clearSession()
                        currentScreen = .publicHome
                    },
                    onNavigateToWizard: {}
                )

            case .customerDashboard:
                CustomerDashboardView(
                    onLogout: {
                        clearSession()
                        currentScreen = .publicHome
                    }
                )

            case .superAdminConsole:
                SuperAdminView(
                    onLogout: {
                        clearSession()
                        currentScreen = .publicHome
                    }
                )
            }
        }
        .onAppear {
            checkExistingSession()
        }
        .onOpenURL { url in
            GIDSignIn.sharedInstance.handle(url)
        }
    }

    private func checkExistingSession() {
        // 1. Check local saved userToken
        if let token = UserDefaults.standard.string(forKey: "userToken"), !token.isEmpty {
            let role = UserDefaults.standard.string(forKey: "userRole") ?? "BUSINESS_OWNER"
            switch role.uppercased() {
            case "SUPER_ADMIN":
                currentScreen = .superAdminConsole
            case "CUSTOMER":
                currentScreen = .customerDashboard
            default:
                currentScreen = .adminDashboard
            }
            return
        }

        // 2. Check if a saved Google session exists in Keychain
        GoogleSignInManager.shared.restorePreviousSignIn { result in
            if case .success(let idToken) = result {
                performBackendAuth(idToken: idToken)
            }
        }
    }

    private func performBackendAuth(idToken: String) {
        guard let url = URL(string: "https://manacity.in/api/auth/google") else { return }
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        let body = ["idToken": idToken]
        req.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: req) { data, response, error in
            DispatchQueue.main.async {
                guard let data = data,
                      let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                      let userObj = json["user"] as? [String: Any],
                      let role = userObj["role"] as? String else { return }

                if let token = json["token"] as? String {
                    UserDefaults.standard.set(token, forKey: "userToken")
                }
                UserDefaults.standard.set(userObj["email"] as? String ?? "", forKey: "userEmail")
                UserDefaults.standard.set(userObj["name"] as? String ?? "", forKey: "userName")
                UserDefaults.standard.set(role, forKey: "userRole")
                UserDefaults.standard.set(userObj["businessName"] as? String ?? "\(userObj["name"] as? String ?? "User")'s Business", forKey: "userBusinessName")

                switch role.uppercased() {
                case "SUPER_ADMIN": currentScreen = .superAdminConsole
                case "CUSTOMER": currentScreen = .customerDashboard
                default: currentScreen = .adminDashboard
                }
            }
        }.resume()
    }

    private func clearSession() {
        // Clear local ManaCity session without purging Google Keychain credentials
        UserDefaults.standard.removeObject(forKey: "userToken")
        UserDefaults.standard.removeObject(forKey: "userRole")
        UserDefaults.standard.removeObject(forKey: "userEmail")
        UserDefaults.standard.removeObject(forKey: "userName")
        UserDefaults.standard.removeObject(forKey: "userBusinessName")
    }
}

@main
struct ManaCityApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
