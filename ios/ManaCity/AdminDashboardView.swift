import SwiftUI

struct UserProfileData: Codable {
    let id: String?
    let email: String?
    let name: String?
    let role: String?
    let profilePicture: String?
    let businessName: String?
}

struct AdminDashboardView: View {
    let onLogout: () -> Void
    let onNavigateToWizard: () -> Void

    @State private var selectedTab: Int = 0
    @State private var userProfile: UserProfileData? = UserProfileData(
        id: nil,
        email: UserDefaults.standard.string(forKey: "userEmail"),
        name: UserDefaults.standard.string(forKey: "userName"),
        role: UserDefaults.standard.string(forKey: "userRole"),
        profilePicture: nil,
        businessName: UserDefaults.standard.string(forKey: "userBusinessName")
    )
    @State private var isLoadingProfile: Bool = false
    @State private var errorMessage: String? = nil

    @State private var showProfileSheet: Bool = false
    @State private var showOnboardingWizard: Bool = false
    @State private var showPrivacyModal: Bool = false
    @State private var showTermsModal: Bool = false
    @State private var showDeleteAccountModal: Bool = false
    @State private var showOptionsDrawerSheet: Bool = false

    let tabs = ["Overview", "Leads (LMS)", "Products & Services", "Marketing", "Reviews & QR", "Website Builder", "Locations", "Referrals"]

    @State private var leads: [Lead] = []

    var body: some View {
        ZStack(alignment: .bottom) {
            Color.manaBackground.ignoresSafeArea()

            VStack(spacing: 0) {
                // MARK: - Top Navigation Bar (Logo + Landing Page + Profile + Logout)
                HStack(spacing: 10) {
                    ManaLogoView(type: .horizontal, height: 30)

                    Spacer()

                    // Landing Page / Explore Button
                    Button(action: onLogout) {
                        HStack(spacing: 4) {
                            Image(systemName: "globe")
                                .font(.system(size: 14, weight: .bold))
                            Text("Explore")
                                .font(.system(size: 12, weight: .bold))
                        }
                        .foregroundColor(.manaViolet)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(Color.manaViolet.opacity(0.12))
                        .cornerRadius(16)
                    }

                    // Profile Icon Button (Switch Google Account)
                    Button(action: { showProfileSheet = true }) {
                        Image(systemName: "person.crop.circle.fill")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.manaViolet)
                            .padding(6)
                            .background(Color.manaViolet.opacity(0.12))
                            .clipShape(Circle())
                    }

                    // Direct Logout Button
                    Button(action: {
                        UserDefaults.standard.removeObject(forKey: "userToken")
                        UserDefaults.standard.removeObject(forKey: "userRole")
                        onLogout()
                    }) {
                        Image(systemName: "rectangle.portrait.and.arrow.right")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.red)
                            .padding(6)
                            .background(Color.red.opacity(0.1))
                            .clipShape(Circle())
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 8)
                .padding(.bottom, 10)
                .background(Color.manaSurfaceDark)
                .overlay(
                    Rectangle()
                        .frame(height: 1)
                        .foregroundColor(Color.manaBorder),
                    alignment: .bottom
                )

                // Navigation Segment Picker with High-Contrast Text
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(0..<tabs.count, id: \.self) { idx in
                            Button(action: { selectedTab = idx }) {
                                Text(tabs[idx])
                                    .font(.system(size: 13, weight: selectedTab == idx ? .bold : .semibold))
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 8)
                                    .background(selectedTab == idx ? Color.manaViolet : Color.manaSurfaceDark)
                                    .foregroundColor(selectedTab == idx ? .white : Color.manaTextSecondary)
                                    .cornerRadius(20)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 20)
                                            .stroke(selectedTab == idx ? Color.manaViolet : Color.manaBorder, lineWidth: 1)
                                    )
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                }
                .background(Color.manaBackground)

                // Tab Content Scroll Area
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 16) {
                        if selectedTab == 0 {
                            OverviewSection(user: userProfile, leads: leads, onSelectTab: { idx in selectedTab = idx })
                        } else if selectedTab == 1 {
                            LeadManagementView(leads: $leads)
                        } else if selectedTab == 2 {
                            ProductsAndServicesView()
                        } else if selectedTab == 3 {
                            MarketingHubView()
                        } else if selectedTab == 4 {
                            ReviewManagementView()
                        } else if selectedTab == 5 {
                            WebsiteBuilderView()
                        } else if selectedTab == 6 {
                            LocationsView()
                        } else {
                            ReferralSection(user: userProfile)
                        }

                        // Bottom Spacing for Floating Tab Bar
                        Spacer().frame(height: 85)
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 8)
                }
            }

            // MARK: - Bottom Navigation Bar with Swipe Up Gesture & Handle
            VStack(spacing: 4) {
                // Swipe Up Pull Handle Indicator
                Button(action: { showOptionsDrawerSheet = true }) {
                    HStack(spacing: 4) {
                        Capsule()
                            .fill(Color.manaViolet.opacity(0.8))
                            .frame(width: 32, height: 4)
                    }
                    .padding(.top, 6)
                }

                HStack(spacing: 0) {
                    // Tab 1: Overview (Index 0)
                    Button(action: { selectedTab = 0 }) {
                        VStack(spacing: 4) {
                            Image(systemName: "chart.pie.fill")
                                .font(.system(size: 18))
                            Text("Overview")
                                .font(.system(size: 10, weight: .bold))
                        }
                        .foregroundColor(selectedTab == 0 ? .manaViolet : .manaTextSecondary)
                        .frame(maxWidth: .infinity)
                    }

                    // Tab 2: LMS Leads (Index 1)
                    Button(action: { selectedTab = 1 }) {
                        VStack(spacing: 4) {
                            Image(systemName: "person.2.fill")
                                .font(.system(size: 18))
                            Text("Leads")
                                .font(.system(size: 10, weight: .semibold))
                        }
                        .foregroundColor(selectedTab == 1 ? .manaViolet : .manaTextSecondary)
                        .frame(maxWidth: .infinity)
                    }

                    // Tab 3: Center Action (Marketing Hub - Index 3)
                    Button(action: { selectedTab = 3 }) {
                        ZStack {
                            Circle()
                                .fill(LinearGradient(colors: [Color.manaViolet, Color.manaTeal], startPoint: .topLeading, endPoint: .bottomTrailing))
                                .frame(width: 50, height: 50)
                                .shadow(color: Color.manaViolet.opacity(0.35), radius: 6, y: 3)
                            Image(systemName: "megaphone.fill")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(.white)
                        }
                    }
                    .offset(y: -10)
                    .frame(maxWidth: .infinity)

                    // Tab 4: Reviews & QR (Index 4)
                    Button(action: { selectedTab = 4 }) {
                        VStack(spacing: 4) {
                            Image(systemName: "qrcode.viewfinder")
                                .font(.system(size: 18))
                            Text("Reviews")
                                .font(.system(size: 10, weight: selectedTab == 4 ? .bold : .semibold))
                        }
                        .foregroundColor(selectedTab == 4 ? .manaViolet : .manaTextSecondary)
                        .frame(maxWidth: .infinity)
                    }

                    // Tab 5: Referrals (Index 7)
                    Button(action: { selectedTab = 7 }) {
                        VStack(spacing: 4) {
                            Image(systemName: "gift.fill")
                                .font(.system(size: 18))
                            Text("Referrals")
                                .font(.system(size: 10, weight: selectedTab == 7 ? .bold : .semibold))
                        }
                        .foregroundColor(selectedTab == 7 ? .manaViolet : .manaTextSecondary)
                        .frame(maxWidth: .infinity)
                    }
                }
                .padding(.horizontal, 8)
                .padding(.bottom, 16)
            }
            .background(Color.manaSurfaceDark.ignoresSafeArea(edges: .bottom))
            .overlay(
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(Color.manaBorder),
                alignment: .top
            )
            .gesture(
                DragGesture(minimumDistance: 15)
                    .onEnded { value in
                        if value.translation.height < -20 {
                            showOptionsDrawerSheet = true
                        }
                    }
            )
        }
        .onAppear {
            fetchAuthenticatedUser()
        }
        .sheet(isPresented: $showOptionsDrawerSheet) {
            BusinessOwnerMenuSheet(
                userProfile: userProfile,
                selectedTab: $selectedTab,
                onClose: { showOptionsDrawerSheet = false }
            )
        }
        .sheet(isPresented: $showProfileSheet) {
            VStack(spacing: 18) {
                Capsule()
                    .fill(Color.gray.opacity(0.3))
                    .frame(width: 40, height: 5)
                    .padding(.top, 10)

                HStack(spacing: 14) {
                    Image(systemName: "person.crop.circle.fill")
                        .font(.system(size: 48))
                        .foregroundColor(.manaViolet)

                    VStack(alignment: .leading, spacing: 4) {
                        Text(userProfile?.businessName ?? userProfile?.name ?? "ManaCity Owner")
                            .font(.system(size: 17, weight: .bold))
                            .foregroundColor(.manaTextPrimary)
                        Text(userProfile?.email ?? "Verified Owner")
                            .font(.system(size: 13))
                            .foregroundColor(.manaTextSecondary)
                        StatusBadge(status: userProfile?.role ?? "BUSINESS_OWNER")
                    }
                    Spacer()
                }
                .padding(16)
                .background(Color.manaSurfaceDark)
                .cornerRadius(16)
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.manaBorder, lineWidth: 1))

                // Switch Google Account Button
                Button(action: {
                    showProfileSheet = false
                    GoogleSignInManager.shared.switchAccount { result in
                        if case .success(let idToken) = result {
                            performSocialLogin(token: idToken)
                        }
                    }
                }) {
                    HStack {
                        Image(systemName: "arrow.triangle.2.circlepath.circle.fill")
                            .font(.system(size: 20))
                            .foregroundColor(.manaViolet)
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Switch Google Account")
                                .font(.system(size: 15, weight: .bold))
                                .foregroundColor(.manaTextPrimary)
                            Text("Sign in with another Gmail / Google account")
                                .font(.system(size: 11))
                                .foregroundColor(.manaTextSecondary)
                        }
                        Spacer()
                        Image(systemName: "chevron.right")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.manaTextSecondary)
                    }
                    .padding(14)
                    .background(Color.white)
                    .cornerRadius(12)
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.manaBorder, lineWidth: 1.5))
                }

                // Launch Wizard Button
                Button(action: {
                    showProfileSheet = false
                    showOnboardingWizard = true
                }) {
                    HStack {
                        Image(systemName: "wand.and.stars")
                            .font(.system(size: 18))
                            .foregroundColor(.manaViolet)
                        Text("Business Onboarding Wizard")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.manaTextPrimary)
                        Spacer()
                        Image(systemName: "chevron.right")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.manaTextSecondary)
                    }
                    .padding(14)
                    .background(Color.manaSurfaceDark)
                    .cornerRadius(12)
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.manaBorder, lineWidth: 1))
                }

                HStack(spacing: 12) {
                    Button(action: { showProfileSheet = false; showPrivacyModal = true }) {
                        Text("Privacy Policy")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.manaTextSecondary)
                    }
                    Text("•").foregroundColor(.manaTextSecondary)
                    Button(action: { showProfileSheet = false; showTermsModal = true }) {
                        Text("Terms")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.manaTextSecondary)
                    }
                    Text("•").foregroundColor(.manaTextSecondary)
                    Button(action: { showProfileSheet = false; showDeleteAccountModal = true }) {
                        Text("Delete Account")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.red)
                    }
                }
                .padding(.vertical, 4)

                // Logout Button
                Button(action: {
                    showProfileSheet = false
                    UserDefaults.standard.removeObject(forKey: "userToken")
                    UserDefaults.standard.removeObject(forKey: "userRole")
                    onLogout()
                }) {
                    HStack {
                        Image(systemName: "rectangle.portrait.and.arrow.right.fill")
                            .font(.system(size: 18))
                            .foregroundColor(.red)
                        Text("Sign Out of ManaCity")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.red)
                        Spacer()
                    }
                    .padding(14)
                    .background(Color.red.opacity(0.08))
                    .cornerRadius(12)
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.red.opacity(0.2), lineWidth: 1))
                }

                Spacer()
            }
            .padding(.horizontal, 20)
            .background(Color.manaBackground.ignoresSafeArea())
        }
        .sheet(isPresented: $showOnboardingWizard) {
            OnboardingWizardView(onComplete: { showOnboardingWizard = false }, onCancel: { showOnboardingWizard = false })
        }
        .sheet(isPresented: $showPrivacyModal) {
            PrivacyAndTermsView(mode: .privacy, onClose: { showPrivacyModal = false })
        }
        .sheet(isPresented: $showTermsModal) {
            PrivacyAndTermsView(mode: .terms, onClose: { showTermsModal = false })
        }
        .sheet(isPresented: $showDeleteAccountModal) {
            PrivacyAndTermsView(mode: .deleteAccount, onClose: { showDeleteAccountModal = false })
        }
    }

    private func fetchAuthenticatedUser() {
        guard let token = UserDefaults.standard.string(forKey: "userToken") else { return }
        guard let url = URL(string: "https://manacity.in/api/auth/me") else { return }

        var req = URLRequest(url: url)
        req.httpMethod = "GET"
        req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: req) { data, response, error in
            DispatchQueue.main.async {
                self.isLoadingProfile = false
                guard let data = data,
                      let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                      let userData = json["user"] as? [String: Any] else { return }

                self.userProfile = UserProfileData(
                    id: userData["id"] as? String,
                    email: userData["email"] as? String,
                    name: userData["name"] as? String,
                    role: userData["role"] as? String,
                    profilePicture: userData["profilePicture"] as? String,
                    businessName: userData["businessName"] as? String
                )
            }
        }.resume()
    }

    private func performSocialLogin(token: String) {
        guard let url = URL(string: "https://manacity.in/api/auth/google") else { return }
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        let body = ["idToken": token]
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

                self.userProfile = UserProfileData(
                    id: userObj["id"] as? String,
                    email: userObj["email"] as? String,
                    name: userObj["name"] as? String,
                    role: role,
                    profilePicture: userObj["profilePicture"] as? String,
                    businessName: userObj["businessName"] as? String
                )
            }
        }.resume()
    }
}

struct OverviewSection: View {
    let user: UserProfileData?
    let leads: [Lead]
    let onSelectTab: (Int) -> Void

    var convertedCount: Int {
        leads.filter { $0.status == "CONVERTED" }.count
    }

    var body: some View {
        VStack(spacing: 16) {
            // Welcome Banner Card
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Welcome back,")
                        .font(.system(size: 13))
                        .foregroundColor(.manaTextSecondary)
                    Text(user?.name ?? "Business Owner")
                        .font(.system(size: 18, weight: .black))
                        .foregroundColor(.manaTextPrimary)
                    Text(user?.email ?? "")
                        .font(.system(size: 11))
                        .foregroundColor(.manaTeal)
                }
                Spacer()
                StatusBadge(status: "ACTIVE TIER")
            }
            .padding(16)
            .background(Color.manaSurfaceDark)
            .cornerRadius(16)
            .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.manaBorder, lineWidth: 1))

            // Real Live Metrics Cards (Zero Dummy Hardcoded Data)
            HStack(spacing: 12) {
                StatCard(title: "Total Customer Leads", value: "\(leads.count)", change: leads.isEmpty ? "No leads yet" : "Live LMS", color: .manaViolet)
                StatCard(title: "Converted Deals", value: "\(convertedCount)", change: leads.isEmpty ? "0% Rate" : "\(Int(Double(convertedCount)/Double(max(1, leads.count))*100))% Rate", color: .manaEmerald)
            }

            // Quick Business Management Actions (All 6 Modules matching Dashboard)
            VStack(alignment: .leading, spacing: 12) {
                Text("Business Management Options")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(.manaTextPrimary)

                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                    OverviewOptionCard(
                        title: "Leads (LMS)",
                        subtitle: "Track customer quote requests",
                        icon: "person.2.fill",
                        color: .manaViolet,
                        badge: "\(leads.count) Leads",
                        action: { onSelectTab(1) }
                    )

                    OverviewOptionCard(
                        title: "Marketing Ads",
                        subtitle: "Meta & Google Ads automation",
                        icon: "sparkles.tv.fill",
                        color: .blue,
                        badge: "Automated",
                        action: { onSelectTab(2) }
                    )

                    OverviewOptionCard(
                        title: "Reviews & QR Stand",
                        subtitle: "Google review poster & 4-star filter",
                        icon: "star.bubble.fill",
                        color: .orange,
                        badge: "QR Stand",
                        action: { onSelectTab(3) }
                    )

                    OverviewOptionCard(
                        title: "Website Builder",
                        subtitle: "Custom domain & section layout",
                        icon: "globe",
                        color: .teal,
                        badge: "Subdomain",
                        action: { onSelectTab(4) }
                    )

                    OverviewOptionCard(
                        title: "Store Locations",
                        subtitle: "Manage branches in Tirupati",
                        icon: "building.2.fill",
                        color: .purple,
                        badge: "Branches",
                        action: { onSelectTab(5) }
                    )

                    OverviewOptionCard(
                        title: "Referral Program",
                        subtitle: "Earn ₹500 per business referral",
                        icon: "gift.fill",
                        color: .pink,
                        badge: "₹500 Reward",
                        action: { onSelectTab(6) }
                    )
                }
            }
        }
    }
}

struct OverviewOptionCard: View {
    let title: String
    let subtitle: String
    let icon: String
    let color: Color
    let badge: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    ZStack {
                        Circle()
                            .fill(color.opacity(0.12))
                            .frame(width: 36, height: 36)
                        Image(systemName: icon)
                            .font(.system(size: 16))
                            .foregroundColor(color)
                    }
                    Spacer()
                    Text(badge)
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(color)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(color.opacity(0.12))
                        .cornerRadius(6)
                }

                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                    Text(subtitle)
                        .font(.system(size: 10))
                        .foregroundColor(.manaTextSecondary)
                        .lineLimit(2)
                }
            }
            .padding(12)
            .background(Color.manaSurfaceDark)
            .cornerRadius(14)
            .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.manaBorder, lineWidth: 1))
        }
    }
}

struct StatCard: View {
    let title: String
    let value: String
    let change: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.manaTextSecondary)
            Text(value)
                .font(.system(size: 22, weight: .bold))
                .foregroundColor(.manaTextPrimary)
            Text(change)
                .font(.system(size: 11, weight: .semibold))
                .foregroundColor(color)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(Color.manaSurfaceDark)
        .cornerRadius(14)
        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.manaBorder, lineWidth: 1))
    }
}

struct LmsSection: View {
    @Binding var leads: [Lead]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Lead Pipeline (\(leads.count))")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.manaTextPrimary)
                Spacer()
                StatusBadge(status: "LMS ACTIVE")
            }

            if leads.isEmpty {
                VStack(spacing: 8) {
                    Image(systemName: "tray")
                        .font(.system(size: 32))
                        .foregroundColor(.manaTextSecondary)
                    Text("No customer inquiries yet")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.manaTextSecondary)
                    Text("Leads generated from Meta Ads, Google Ads, or your website will appear here in real-time.")
                        .font(.system(size: 12))
                        .foregroundColor(.manaTextSecondary)
                        .multilineTextAlignment(.center)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 30)
            } else {
                ForEach(leads) { lead in
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            VStack(alignment: .leading) {
                                Text(lead.name)
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.manaTextPrimary)
                                Text("\(lead.phone) • \(lead.source)")
                                    .font(.system(size: 13))
                                    .foregroundColor(.manaTextSecondary)
                            }
                            Spacer()
                            StatusBadge(status: lead.status)
                        }

                        if !lead.notes.isEmpty {
                            Text(lead.notes)
                                .font(.system(size: 12))
                                .foregroundColor(.manaTextSecondary)
                        }
                    }
                    .padding(14)
                    .background(Color.manaSurfaceDark)
                    .cornerRadius(14)
                    .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.manaBorder, lineWidth: 1))
                }
            }
        }
    }
}

struct MarketingSection: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            VStack(alignment: .leading, spacing: 10) {
                Text("Meta Ads Integration")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.manaTextPrimary)
                Text("Auto-sync leads directly from Facebook & Instagram lead forms.")
                    .font(.system(size: 12))
                    .foregroundColor(.manaTextSecondary)
                ManaGradientButton(title: "Connect Facebook Page") {}
            }
            .padding(16)
            .background(Color.manaSurfaceDark)
            .cornerRadius(16)
            .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.manaBorder, lineWidth: 1))
        }
    }
}

struct ReviewSection: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Review QR Poster Generator")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.manaTextPrimary)
                Text("Generate high-resolution printable table stand posters.")
                    .font(.system(size: 12))
                    .foregroundColor(.manaTextSecondary)
            }
            .padding(16)
            .background(Color.manaSurfaceDark)
            .cornerRadius(16)
            .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.manaBorder, lineWidth: 1))
        }
    }
}

struct ReferralSection: View {
    let user: UserProfileData?

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Refer & Earn Program")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.manaTextPrimary)
                Text("Earn ₹500 for every business that joins using your referral link.")
                    .font(.system(size: 13))
                    .foregroundColor(.manaTextSecondary)
                Text("https://manacity.in/register?ref=\(user?.id ?? "PRO500")")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(.manaTeal)
            }
            .padding(16)
            .background(Color.manaSurfaceDark)
            .cornerRadius(16)
            .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.manaBorder, lineWidth: 1))
        }
    }
}

// MARK: - Business Owner Swipe-Up Navigation Drawer Sheet
struct BusinessOwnerMenuSheet: View {
    let userProfile: UserProfileData?
    @Binding var selectedTab: Int
    let onClose: () -> Void

    let options: [(title: String, subtitle: String, icon: String, tabIdx: Int, color: Color, badge: String)] = [
        ("Overview & Analytics", "Real-time metrics & performance", "chart.pie.fill", 0, .manaViolet, "DASHBOARD"),
        ("Lead Management (LMS)", "Track customer quote inquiries", "person.2.fill", 1, .blue, "LMS PRO"),
        ("Products & Services", "Master library offerings & catalog", "square.grid.3x3.fill", 2, .manaAmber, "CATALOG"),
        ("Marketing Hub", "Meta Ads, Instagram & Google SEO", "megaphone.fill", 3, .pink, "META & GOOGLE"),
        ("Reviews & QR Scanners", "Google Review QR stands & filter", "qrcode.viewfinder", 4, .orange, "QR STANDS"),
        ("Website Builder", "Custom subdomain & section editor", "globe", 5, .manaTeal, "STOREFRONT"),
        ("Store Locations", "Manage Tirupati business branches", "building.2.fill", 6, .purple, "BRANCHES"),
        ("Referral Program", "Earn ₹500 per business referral", "gift.fill", 7, .pink, "EARN ₹500")
    ]

    var body: some View {
        VStack(spacing: 16) {
            Capsule().fill(Color.gray.opacity(0.4)).frame(width: 40, height: 5).padding(.top, 10)

            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Business Management Options")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                    Text(userProfile?.name ?? "Business Owner Console")
                        .font(.system(size: 12))
                        .foregroundColor(.manaTeal)
                }
                Spacer()
                Button(action: onClose) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 22))
                        .foregroundColor(.manaTextSecondary)
                }
            }
            .padding(.horizontal, 16)

            ScrollView(showsIndicators: false) {
                VStack(spacing: 10) {
                    ForEach(options, id: \.tabIdx) { opt in
                        Button(action: {
                            selectedTab = opt.tabIdx
                            onClose()
                        }) {
                            HStack(spacing: 12) {
                                ZStack {
                                    Circle()
                                        .fill(opt.color.opacity(0.15))
                                        .frame(width: 40, height: 40)
                                    Image(systemName: opt.icon)
                                        .font(.system(size: 18))
                                        .foregroundColor(opt.color)
                                }

                                VStack(alignment: .leading, spacing: 2) {
                                    Text(opt.title)
                                        .font(.system(size: 14, weight: .bold))
                                        .foregroundColor(.manaTextPrimary)
                                    Text(opt.subtitle)
                                        .font(.system(size: 11))
                                        .foregroundColor(.manaTextSecondary)
                                }

                                Spacer()

                                Text(opt.badge)
                                    .font(.system(size: 9, weight: .black))
                                    .foregroundColor(opt.color)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 3)
                                    .background(opt.color.opacity(0.12))
                                    .cornerRadius(6)

                                Image(systemName: "chevron.right")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(.manaTextSecondary)
                            }
                            .padding(12)
                            .background(selectedTab == opt.tabIdx ? Color.manaViolet.opacity(0.15) : Color.manaSurfaceDark)
                            .cornerRadius(14)
                            .overlay(
                                RoundedRectangle(cornerRadius: 14)
                                    .stroke(selectedTab == opt.tabIdx ? Color.manaViolet : Color.manaBorder, lineWidth: 1)
                            )
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 20)
            }
        }
        .background(Color.manaBackground.ignoresSafeArea())
    }
}
