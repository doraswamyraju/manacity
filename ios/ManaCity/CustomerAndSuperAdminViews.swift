import SwiftUI

struct CustomerDashboardView: View {
    let onLogout: () -> Void
    @State private var selectedTab = 0
    @State private var showProfileSheet = false

    var userEmail: String { UserDefaults.standard.string(forKey: "userEmail") ?? "Customer" }
    var userName: String { UserDefaults.standard.string(forKey: "userName") ?? "User" }

    var body: some View {
        ZStack {
            Color.manaBackground.ignoresSafeArea()

            VStack(spacing: 0) {
                // Topbar (Logo + Landing Page + Profile + Logout)
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

                    // Profile Icon Button
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
                .padding(.vertical, 10)
                .background(Color.manaSurfaceDark)

                Picker("Tabs", selection: $selectedTab) {
                    Text("Enquiries").tag(0)
                    Text("Reviews").tag(1)
                    Text("Saved").tag(2)
                }
                .pickerStyle(.segmented)
                .padding()

                ScrollView {
                    VStack(spacing: 12) {
                        if selectedTab == 0 {
                            VStack(alignment: .leading) {
                                Text("Grand Spice Restaurant")
                                    .font(.headline)
                                    .foregroundColor(.manaTextPrimary)
                                Text("Table booking inquiry for 4 guests")
                                    .font(.subheadline)
                                    .foregroundColor(.manaTextSecondary)
                            }
                            .manaGlassCard()
                        } else if selectedTab == 1 {
                            VStack(alignment: .leading) {
                                Text("Apex Dental Clinic")
                                    .font(.headline)
                                    .foregroundColor(.manaTextPrimary)
                                Text("5 ★ - Excellent teeth cleaning experience!")
                                    .font(.subheadline)
                                    .foregroundColor(.manaTextSecondary)
                            }
                            .manaGlassCard()
                        } else {
                            VStack(alignment: .leading) {
                                Text("Sri Sai Electricals")
                                    .font(.headline)
                                    .foregroundColor(.manaTextPrimary)
                                Text("Electrician • Tirupati")
                                    .font(.subheadline)
                                    .foregroundColor(.manaTextSecondary)
                            }
                            .manaGlassCard()
                        }
                    }
                    .padding(.horizontal)
                }
            }
        }
        .sheet(isPresented: $showProfileSheet) {
            VStack(spacing: 18) {
                Capsule().fill(Color.gray.opacity(0.3)).frame(width: 40, height: 5).padding(.top, 10)
                HStack(spacing: 14) {
                    Image(systemName: "person.crop.circle.fill").font(.system(size: 48)).foregroundColor(.manaViolet)
                    VStack(alignment: .leading, spacing: 4) {
                        Text(userName).font(.system(size: 17, weight: .bold)).foregroundColor(.manaTextPrimary)
                        Text(userEmail).font(.system(size: 13)).foregroundColor(.manaTextSecondary)
                    }
                    Spacer()
                }
                .padding(16).background(Color.manaSurfaceDark).cornerRadius(16)

                Button(action: {
                    showProfileSheet = false
                    GoogleSignInManager.shared.switchAccount { result in
                        if case .success(let token) = result {
                            performSocialLogin(token: token)
                        }
                    }
                }) {
                    HStack {
                        Image(systemName: "arrow.triangle.2.circlepath.circle.fill").font(.system(size: 20)).foregroundColor(.manaViolet)
                        Text("Switch Google Account").font(.system(size: 15, weight: .bold)).foregroundColor(.manaTextPrimary)
                        Spacer()
                        Image(systemName: "chevron.right").font(.system(size: 12, weight: .bold)).foregroundColor(.manaTextSecondary)
                    }
                    .padding(14).background(Color.white).cornerRadius(12)
                }

                Button(action: {
                    showProfileSheet = false
                    onLogout()
                }) {
                    HStack {
                        Image(systemName: "rectangle.portrait.and.arrow.right.fill").font(.system(size: 18)).foregroundColor(.red)
                        Text("Sign Out").font(.system(size: 15, weight: .bold)).foregroundColor(.red)
                        Spacer()
                    }
                    .padding(14).background(Color.red.opacity(0.08)).cornerRadius(12)
                }
                Spacer()
            }
            .padding(.horizontal, 20)
            .background(Color.manaBackground.ignoresSafeArea())
        }
    }

    private func performSocialLogin(token: String) {
        guard let url = URL(string: "https://manacity.in/api/auth/google") else { return }
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = try? JSONSerialization.data(withJSONObject: ["idToken": token])
        URLSession.shared.dataTask(with: req) { data, _, _ in
            DispatchQueue.main.async {
                guard let data = data,
                      let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                      let userObj = json["user"] as? [String: Any] else { return }
                if let t = json["token"] as? String { UserDefaults.standard.set(t, forKey: "userToken") }
                UserDefaults.standard.set(userObj["email"] as? String ?? "", forKey: "userEmail")
                UserDefaults.standard.set(userObj["name"] as? String ?? "", forKey: "userName")
                UserDefaults.standard.set(userObj["role"] as? String ?? "", forKey: "userRole")
            }
        }.resume()
    }
}

struct SuperAdminView: View {
    let onLogout: () -> Void

    var body: some View {
        ZStack {
            Color.manaBackground.ignoresSafeArea()
            VStack {
                HStack {
                    ManaLogoView(type: .horizontal, height: 30)
                    Spacer()
                    Button(action: onLogout) {
                        Image(systemName: "rectangle.portrait.and.arrow.right").foregroundColor(.red)
                    }
                }
                .padding()
                .background(Color.manaSurfaceDark)

                Text("Super Admin Platform Management").font(.title2).bold().padding()
                Spacer()
            }
        }
    }
}
