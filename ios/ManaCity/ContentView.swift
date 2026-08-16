import SwiftUI

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
    }

    private func checkExistingSession() {
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
        }
    }

    private func clearSession() {
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
