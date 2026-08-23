import SwiftUI

struct CustomerMainTabView: View {
    let onSelectBusiness: (Business) -> Void
    let onNavigateToLogin: () -> Void
    let onNavigateToRegister: () -> Void
    let onLogout: () -> Void

    @State private var selectedTab: Int = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            // Tab 1: Customer Home Screen
            PublicHomeView(
                onSelectBusiness: onSelectBusiness,
                onNavigateToLogin: onNavigateToLogin,
                onNavigateToRegister: onNavigateToRegister
            )
            .tabItem {
                Label("Home", systemImage: "house.fill")
            }
            .tag(0)

            // Tab 2: Discovery & Explore Screen
            CustomerExploreView(onSelectBusiness: onSelectBusiness)
                .tabItem {
                    Label("Explore", systemImage: "magnifyingglass")
                }
                .tag(1)

            // Tab 3: Quick Quote Broadcast
            CustomerQuickQuoteView()
                .tabItem {
                    Label("Quotes", systemImage: "bolt.fill")
                }
                .tag(2)

            // Tab 4: My Enquiries & Tracking Status
            CustomerDashboardView(onLogout: onLogout)
                .tabItem {
                    Label("My Enquiries", systemImage: "tray.fill")
                }
                .tag(3)
        }
        .accentColor(.manaViolet)
    }
}
