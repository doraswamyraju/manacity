import SwiftUI

struct AdminDashboardView: View {
    let onLogout: () -> Void
    let onNavigateToWizard: () -> Void

    @State private var selectedTab: Int = 0
    let tabs = ["Overview", "LMS Leads", "Marketing", "Reviews", "Referrals"]

    @State private var leads = [
        Lead(name: "Raju Sharma", phone: "+91 9888877777", source: "Meta Ads", status: "NEW", notes: "Interested in catering for 50 people", createdAt: "10 mins ago"),
        Lead(name: "Priya Verma", phone: "+91 9777766666", source: "Website", status: "CONTACTED", notes: "Asked for menu & pricing", createdAt: "2 hours ago"),
        Lead(name: "Kiran Kumar", phone: "+91 9666655555", source: "Google QR", status: "CONVERTED", notes: "Booked table for anniversary", createdAt: "Yesterday", dealAmount: 15000.0)
    ]

    var body: some View {
        ZStack {
            Color.manaBackground.ignoresSafeArea()

            VStack(spacing: 0) {
                // Header Bar
                HStack {
                    VStack(alignment: .leading) {
                        Text("ManaCity Business")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.manaTextPrimary)
                        Text("Grand Spice Restaurant")
                            .font(.system(size: 12))
                            .foregroundColor(.manaTeal)
                    }
                    Spacer()
                    Button(action: onNavigateToWizard) {
                        Image(systemName: "gearshape.fill")
                            .foregroundColor(.manaTextSecondary)
                    }
                    Button(action: onLogout) {
                        Image(systemName: "rectangle.portrait.and.arrow.right")
                            .foregroundColor(.red)
                    }
                }
                .padding()
                .background(Color.manaSurfaceDark)

                // Navigation Segment Picker
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(0..<tabs.count, id: \.self) { idx in
                            Button(action: { selectedTab = idx }) {
                                Text(tabs[idx])
                                    .font(.system(size: 13, weight: selectedTab == idx ? .bold : .regular))
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 8)
                                    .background(selectedTab == idx ? Color.manaViolet : Color.manaSurfaceDark)
                                    .foregroundColor(.white)
                                    .cornerRadius(12)
                            }
                        }
                    }
                    .padding()
                }

                // Tab Contents
                ScrollView {
                    VStack(spacing: 16) {
                        if selectedTab == 0 {
                            OverviewSection()
                        } else if selectedTab == 1 {
                            LmsSection(leads: $leads)
                        } else if selectedTab == 2 {
                            MarketingSection()
                        } else if selectedTab == 3 {
                            ReviewSection()
                        } else {
                            ReferralSection()
                        }
                    }
                    .padding()
                }
            }
        }
    }
}

struct OverviewSection: View {
    var body: some View {
        VStack(spacing: 14) {
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
                .font(.system(size: 12))
                .foregroundColor(.manaTextSecondary)
            Text(value)
                .font(.system(size: 22, weight: .bold))
                .foregroundColor(.manaTextPrimary)
            Text(change)
                .font(.system(size: 11, weight: .semibold))
                .foregroundColor(color)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .manaGlassCard()
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
                .manaGlassCard()
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
            .manaGlassCard()
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
            .manaGlassCard()
        }
    }
}

struct ReferralSection: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Refer & Earn Program")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.manaTextPrimary)
                Text("Earn ₹500 for every business that joins using your code.")
                    .font(.system(size: 13))
                    .foregroundColor(.manaTextSecondary)
                Text("https://manacity.in/register?ref=SPICE500")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(.manaTeal)
            }
            .manaGlassCard()
        }
    }
}
