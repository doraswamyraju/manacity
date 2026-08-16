import SwiftUI

struct SuperAdminConsoleView: View {
    let onLogout: () -> Void
    @State private var selectedTab: Int = 0

    var body: some View {
        ZStack {
            Color.manaBackground.ignoresSafeArea()

            VStack(spacing: 0) {
                // Top Navigation Bar
                HStack(spacing: 10) {
                    ManaLogoView(type: .horizontal, height: 30)

                    Spacer()

                    Text("SUPER ADMIN")
                        .font(.system(size: 10, weight: .black))
                        .foregroundColor(.white)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.purple)
                        .cornerRadius(8)

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

                Picker("Console View", selection: $selectedTab) {
                    Text("Approvals").tag(0)
                    Text("Directory").tag(1)
                    Text("Analytics").tag(2)
                }
                .pickerStyle(.segmented)
                .padding()

                ScrollView {
                    VStack(spacing: 14) {
                        if selectedTab == 0 {
                            VStack(alignment: .leading, spacing: 10) {
                                Text("Pending Business Approvals")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.manaTextPrimary)

                                VStack(alignment: .leading, spacing: 10) {
                                    HStack {
                                        VStack(alignment: .leading, spacing: 2) {
                                            Text("Tirupati Fitness Gym")
                                                .font(.system(size: 14, weight: .bold))
                                                .foregroundColor(.manaTextPrimary)
                                            Text("Submitted by: owner@gym.com")
                                                .font(.system(size: 12))
                                                .foregroundColor(.manaTextSecondary)
                                        }
                                        Spacer()
                                        Button(action: {}) {
                                            Text("Approve")
                                                .font(.system(size: 12, weight: .bold))
                                                .foregroundColor(.white)
                                                .padding(.horizontal, 12)
                                                .padding(.vertical, 6)
                                                .background(Color.green)
                                                .cornerRadius(8)
                                        }
                                    }
                                }
                                .padding(12)
                                .background(Color.manaSurfaceDark)
                                .cornerRadius(12)
                            }
                        } else if selectedTab == 1 {
                            VStack(alignment: .leading, spacing: 10) {
                                Text("Platform Business Directory")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.manaTextPrimary)

                                ForEach(["Kumar Shirts", "Rajugari Ventures", "Thyrocare Tirupati"], id: \.self) { b in
                                    HStack {
                                        Text(b)
                                            .font(.system(size: 14, weight: .semibold))
                                            .foregroundColor(.manaTextPrimary)
                                        Spacer()
                                        Text("Active")
                                            .font(.system(size: 11, weight: .bold))
                                            .foregroundColor(.green)
                                    }
                                    .padding(12)
                                    .background(Color.manaSurfaceDark)
                                    .cornerRadius(10)
                                }
                            }
                        } else {
                            VStack(alignment: .leading, spacing: 14) {
                                Text("Platform Growth Analytics")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.manaTextPrimary)

                                HStack(spacing: 12) {
                                    StatCard(title: "Total Businesses", value: "142", change: "Active", color: .manaViolet)
                                    StatCard(title: "Monthly Leads", value: "1,890", change: "+18%", color: .green)
                                }
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                }
            }
        }
    }
}
