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

    let tabs = ["Overview", "Leads (LMS)", "Marketing", "Reviews & QR", "Referrals"]

    @State private var leads = [
        Lead(name: "Raju Sharma", phone: "+91 9888877777", source: "Meta Ads", status: "NEW", notes: "Interested in catering for 50 people", createdAt: "10 mins ago"),
        Lead(name: "Priya Verma", phone: "+91 9777766666", source: "Website", status: "CONTACTED", notes: "Asked for menu & pricing", createdAt: "2 hours ago"),
        Lead(name: "Kiran Kumar", phone: "+91 9666655555", source: "Google QR", status: "CONVERTED", notes: "Booked table for anniversary", createdAt: "Yesterday", dealAmount: 15000.0)
    ]

    var body: some View {
        ZStack(alignment: .bottom) {
            Color.manaBackground.ignoresSafeArea()

            VStack(spacing: 0) {
                // MARK: - Clean Top Navigation Bar (Logo + Profile Icon)
                HStack(spacing: 12) {
                    ManaLogoView(type: .horizontal, height: 32)

                    Spacer()

                    // Single Profile Icon Button
                    Button(action: { showProfileSheet = true }) {
                        Image(systemName: "person.crop.circle.fill")
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(.manaViolet)
                            .padding(8)
                            .background(Color.manaViolet.opacity(0.12))
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
                            OverviewSection(user: userProfile)
                        } else if selectedTab == 1 {
                            LmsSection(leads: $leads)
                        } else if selectedTab == 2 {
                            MarketingSection()
                        } else if selectedTab == 3 {
                            ReviewSection()
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

            // MARK: - Bottom Navigation Bar
            HStack(spacing: 0) {
                // Tab 1: Overview
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

                // Tab 2: LMS Leads
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

                // Tab 3: Center Action (Marketing / AI)
                Button(action: { selectedTab = 2 }) {
                    ZStack {
                        Circle()
                            .fill(LinearGradient(colors: [Color.manaViolet, Color.manaTeal], startPoint: .topLeading, endPoint: .bottomTrailing))
                            .frame(width: 50, height: 50)
                            .shadow(color: Color.manaViolet.opacity(0.35), radius: 6, y: 3)
                        Image(systemName: "bolt.fill")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                    }
                }
                .offset(y: -12)
                .frame(maxWidth: .infinity)

                // Tab 4: Reviews & QR
                Button(action: { selectedTab = 3 }) {
                    VStack(spacing: 4) {
                        Image(systemName: "qrcode.viewfinder")
                            .font(.system(size: 18))
                        Text("Reviews")
                            .font(.system(size: 10, weight: .semibold))
                    }
                    .foregroundColor(selectedTab == 3 ? .manaViolet : .manaTextSecondary)
                    .frame(maxWidth: .infinity)
                }

                // Tab 5: Referrals
                Button(action: { selectedTab = 4 }) {
                    VStack(spacing: 4) {
                        Image(systemName: "gift.fill")
                            .font(.system(size: 18))
                        Text("Referrals")
                            .font(.system(size: 10, weight: .semibold))
                    }
                    .foregroundColor(selectedTab == 4 ? .manaViolet : .manaTextSecondary)
                    .frame(maxWidth: .infinity)
                }
            }
            .padding(.horizontal, 8)
            .padding(.top, 10)
            .padding(.bottom, 22)
            .background(Color.manaSurfaceDark.ignoresSafeArea(edges: .bottom))
            .overlay(
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(Color.manaBorder),
                alignment: .top
            )
        }
        .onAppear {
            fetchAuthenticatedUser()
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

    var body: some View {
        VStack(spacing: 14) {
            // Welcome Card
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
            .padding()
            .background(Color.manaSurfaceDark)
            .cornerRadius(16)
            .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.manaBorder, lineWidth: 1))

            HStack(spacing: 12) {
                StatCard(title: "Total Leads", value: "128", change: "+18%", color: .manaViolet)
                StatCard(title: "Converted", value: "42", change: "32.8%", color: .manaEmerald)
            }
            HStack(spacing: 12) {
                StatCard(title: "Profile Views", value: "3.4k", change: "+24%", color: .manaTeal)
                StatCard(title: "Avg Rating", value: "4.9 ★", change: "142 revs", color: .manaAmber)
            }
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
