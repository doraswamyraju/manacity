import SwiftUI

struct CustomerDashboardView: View {
    let onLogout: () -> Void
    @State private var selectedTab = 0

    var body: some View {
        ZStack {
            Color.manaBackground.ignoresSafeArea()

            VStack(spacing: 0) {
                HStack {
                    VStack(alignment: .leading) {
                        Text("My ManaCity Account")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.manaTextPrimary)
                        Text("Customer Dashboard")
                            .font(.system(size: 12))
                            .foregroundColor(.manaTeal)
                    }
                    Spacer()
                    Button(action: onLogout) {
                        Image(systemName: "rectangle.portrait.and.arrow.right")
                            .foregroundColor(.red)
                    }
                }
                .padding()
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
                                Text("Royal Fitness Gym")
                                    .font(.headline)
                                    .foregroundColor(.manaTextPrimary)
                                Text("Saved place in Indiranagar, Blr")
                                    .font(.subheadline)
                                    .foregroundColor(.manaTextSecondary)
                            }
                            .manaGlassCard()
                        }
                    }
                    .padding()
                }
            }
        }
    }
}

struct SuperAdminView: View {
    let onLogout: () -> Void

    var body: some View {
        ZStack {
            Color.manaBackground.ignoresSafeArea()

            VStack(spacing: 16) {
                HStack {
                    Text("Super Admin Console")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.manaTextPrimary)
                    Spacer()
                    Button(action: onLogout) {
                        Image(systemName: "rectangle.portrait.and.arrow.right")
                            .foregroundColor(.red)
                    }
                }
                .padding()
                .background(Color.manaSurfaceDark)

                ScrollView {
                    VStack(alignment: .leading, spacing: 14) {
                        Text("Pending Business Claims (2)")
                            .font(.headline)
                            .foregroundColor(.manaTextPrimary)

                        VStack(alignment: .leading, spacing: 8) {
                            Text("Grand Spice Restaurant")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.manaTextPrimary)
                            Text("Claimant: Raju Sharma (Proof attached)")
                                .font(.system(size: 13))
                                .foregroundColor(.manaTextSecondary)

                            HStack {
                                Button("Approve Claim") {}
                                    .buttonStyle(.borderedProminent)
                                    .tint(.manaEmerald)
                                Button("Reject") {}
                                    .buttonStyle(.bordered)
                                    .tint(.red)
                            }
                        }
                        .manaGlassCard()
                    }
                    .padding()
                }
            }
        }
    }
}
