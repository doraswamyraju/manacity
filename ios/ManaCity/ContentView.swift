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
                    onNavigateToRegister: { currentScreen = .register }
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
                    onNavigateToLogin: { currentScreen = .login }
                )

            case .adminDashboard:
                AdminDashboardView(
                    onLogout: { currentScreen = .publicHome },
                    onNavigateToWizard: {}
                )

            case .customerDashboard:
                CustomerDashboardView(
                    onLogout: { currentScreen = .publicHome }
                )

            case .superAdminConsole:
                SuperAdminView(
                    onLogout: { currentScreen = .publicHome }
                )
            }
        }
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

