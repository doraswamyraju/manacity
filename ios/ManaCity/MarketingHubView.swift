import SwiftUI

struct MarketingHubView: View {
    @State private var selectedMainTab: Int = 0 // 0: Instagram, 1: Facebook, 2: Google, 3: Asset Library, 4: Meta Ads
    @State private var igSubTab: Int = 0 // 0: Stats, 1: Posts, 2: Schedule, 3: Ads

    // Post Creation State
    @State private var postCaption: String = ""
    @State private var postMediaUrl: String = ""
    @State private var isPublishing: Bool = false
    @State private var publishSuccess: Bool = false

    // Meta Ads Manager State
    @State private var adObjective: String = "Lead Generation"
    @State private var dailyBudget: String = "500"
    @State private var targetAudience: String = "Tirupati Local (18-45 yrs)"

    let mainTabs = ["Instagram Hub", "Facebook & DMs", "Google SEO & Maps", "Asset Library", "Meta Ads Manager"]
    let igSubTabs = ["📈 Statistics & Insights", "🖼 Posts & Feed Activity", "🗓 Schedule New Post", "📣 Instagram Ads"]

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // MARK: - Main Sub-Navigation Tabs (Matching Web Left Menu)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(0..<mainTabs.count, id: \.self) { idx in
                        Button(action: { selectedMainTab = idx }) {
                            HStack(spacing: 4) {
                                if idx == 0 { Image(systemName: "camera.fill") }
                                else if idx == 1 { Image(systemName: "hand.thumbsup.fill") }
                                else if idx == 2 { Image(systemName: "globe") }
                                else if idx == 3 { Image(systemName: "folder.fill") }
                                else { Image(systemName: "megaphone.fill") }

                                Text(mainTabs[idx])
                            }
                            .font(.system(size: 12, weight: selectedMainTab == idx ? .bold : .semibold))
                            .padding(.horizontal, 14)
                            .padding(.vertical, 8)
                            .background(selectedMainTab == idx ? Color.manaViolet : Color.manaSurfaceDark)
                            .foregroundColor(selectedMainTab == idx ? .white : .manaTextSecondary)
                            .cornerRadius(20)
                            .overlay(
                                RoundedRectangle(cornerRadius: 20)
                                    .stroke(selectedMainTab == idx ? Color.manaViolet : Color.manaBorder, lineWidth: 1)
                            )
                        }
                    }
                }
            }

            // MARK: - Selected Tab Content View
            if selectedMainTab == 0 {
                // INSTAGRAM HUB
                InstagramHubContentView(
                    igSubTab: $igSubTab,
                    igSubTabs: igSubTabs,
                    postCaption: $postCaption,
                    postMediaUrl: $postMediaUrl,
                    isPublishing: $isPublishing,
                    publishSuccess: $publishSuccess,
                    onPublish: handlePublishPost
                )
            } else if selectedMainTab == 1 {
                // FACEBOOK & DMS
                FacebookHubContentView()
            } else if selectedMainTab == 2 {
                // GOOGLE SEO & MAPS
                GoogleSeoContentView()
            } else if selectedMainTab == 3 {
                // ASSET LIBRARY
                AssetLibraryContentView()
            } else {
                // META ADS MANAGER
                MetaAdsManagerContentView(
                    adObjective: $adObjective,
                    dailyBudget: $dailyBudget,
                    targetAudience: $targetAudience
                )
            }
        }
    }

    private func handlePublishPost() {
        isPublishing = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            isPublishing = false
            publishSuccess = true
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                publishSuccess = false
                postCaption = ""
                postMediaUrl = ""
            }
        }
    }
}

// MARK: - Instagram Hub Content View (Matching Web Screenshot)
struct InstagramHubContentView: View {
    @Binding var igSubTab: Int
    let igSubTabs: [String]
    @Binding var postCaption: String
    @Binding var postMediaUrl: String
    @Binding var isPublishing: Bool
    @Binding var publishSuccess: Bool
    let onPublish: () -> Void

    @State private var showDiagnostics: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Mode Pills Row
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(0..<igSubTabs.count, id: \.self) { idx in
                        Button(action: { igSubTab = idx }) {
                            Text(igSubTabs[idx])
                                .font(.system(size: 11, weight: igSubTab == idx ? .bold : .medium))
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(igSubTab == idx ? Color.pink : Color.manaSurfaceDark)
                                .foregroundColor(igSubTab == idx ? .white : .manaTextSecondary)
                                .cornerRadius(16)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(igSubTab == idx ? Color.pink : Color.manaBorder, lineWidth: 1)
                                )
                        }
                    }
                }
            }

            // Header Banner Card
            VStack(alignment: .leading, spacing: 10) {
                HStack(spacing: 12) {
                    ZStack {
                        RoundedRectangle(cornerRadius: 12)
                            .fill(LinearGradient(colors: [.orange, .pink, .purple], startPoint: .topLeading, endPoint: .bottomTrailing))
                            .frame(width: 44, height: 44)
                        Image(systemName: "camera.fill")
                            .font(.system(size: 20))
                            .foregroundColor(.white)
                    }

                    VStack(alignment: .leading, spacing: 2) {
                        HStack(spacing: 4) {
                            Text("Instagram Business Hub")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.white)
                            Text("(@rajugari_ventures)")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(.pink)
                        }
                        Text("Manage posts, view live Graph API insights & auto-sync DMs directly to LetsTrack live chat.")
                            .font(.system(size: 11))
                            .foregroundColor(.manaTextSecondary)
                    }
                    Spacer()
                }

                // Sync Status Buttons
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        Text("● Sync: PARTIAL")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.orange)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(Color.orange.opacity(0.15))
                            .cornerRadius(12)

                        HStack(spacing: 4) {
                            Image(systemName: "arrow.clockwise")
                            Text("Refresh Meta Stats")
                        }
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 5)
                        .background(Color.white.opacity(0.1))
                        .cornerRadius(8)

                        HStack(spacing: 4) {
                            Image(systemName: "message.fill")
                            Text("LetsTrack DM Sync: Active")
                        }
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.manaTeal)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 5)
                        .background(Color.manaTeal.opacity(0.15))
                        .cornerRadius(12)
                    }
                }
            }
            .padding(14)
            .background(Color.manaSurfaceDark)
            .cornerRadius(16)
            .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.pink.opacity(0.3), lineWidth: 1))

            // Meta API Diagnostics Collapsible Card
            VStack(alignment: .leading, spacing: 8) {
                Button(action: { showDiagnostics.toggle() }) {
                    HStack {
                        Image(systemName: "exclamationmark.circle.fill")
                            .foregroundColor(.pink)
                        Text("Meta API Diagnostics & Connection Details (Developer Mode)")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.manaTextSecondary)
                        Spacer()
                        Image(systemName: showDiagnostics ? "chevron.up" : "chevron.down")
                            .font(.system(size: 10))
                            .foregroundColor(.manaTextSecondary)
                    }
                }

                if showDiagnostics {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Graph API Version: v24.0")
                        Text("Page ID (Masked): 1029****384")
                        Text("Instagram Account ID (Masked): 1784****920")
                        Text("Sync Status: PARTIAL")
                            .foregroundColor(.orange)
                        Text("Last Sync: 19:45:00 IST")
                    }
                    .font(.system(size: 10))
                    .foregroundColor(.manaTextSecondary)
                    .padding(.top, 4)
                }
            }
            .padding(12)
            .background(Color.manaSurfaceDark)
            .cornerRadius(12)
            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.manaBorder, lineWidth: 1))

            // Live Account Insights Grid (Matching Web Screenshot)
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                InsightCard(title: "Followers Count", value: "8,968", subtitle: "Instagram followers", color: .pink, icon: "person.2.fill")
                InsightCard(title: "Account Impressions", value: "N/A", subtitle: "(#10) Dev Mode active", color: .manaTextSecondary, icon: "eye.fill")
                InsightCard(title: "Account Reach", value: "N/A", subtitle: "(#10) Dev Mode active", color: .manaTextSecondary, icon: "chart.line.uptrend.xyaxis")
                InsightCard(title: "Profile Visits", value: "N/A", subtitle: "(#10) Dev Mode active", color: .manaTextSecondary, icon: "globe")
            }

            // Create & Schedule Post Section
            VStack(alignment: .leading, spacing: 12) {
                Text("Create & Schedule Instagram Post")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.manaTextPrimary)

                if publishSuccess {
                    HStack {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(.green)
                        Text("Post Successfully Scheduled to Instagram!")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.green)
                    }
                    .padding()
                    .background(Color.green.opacity(0.12))
                    .cornerRadius(10)
                }

                CustomFormField(label: "Post Caption", placeholder: "Write an engaging caption for your Instagram followers...", text: $postCaption)
                CustomFormField(label: "Media / Image URL", placeholder: "https://... or upload poster image", text: $postMediaUrl)

                HStack(spacing: 10) {
                    Button(action: onPublish) {
                        HStack {
                            if isPublishing {
                                ProgressView().tint(.white)
                            } else {
                                Image(systemName: "paperplane.fill")
                                Text("Publish Now")
                            }
                        }
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(LinearGradient(colors: [.pink, .purple], startPoint: .leading, endPoint: .trailing))
                        .cornerRadius(10)
                    }

                    Button(action: onPublish) {
                        HStack {
                            Image(systemName: "calendar")
                            Text("Schedule Post")
                        }
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.manaViolet)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(Color.manaViolet.opacity(0.15))
                        .cornerRadius(10)
                    }
                }
            }
            .padding(14)
            .background(Color.manaSurfaceDark)
            .cornerRadius(14)
            .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.manaBorder, lineWidth: 1))

            // Recent Published Media & Activity Section
            VStack(alignment: .leading, spacing: 10) {
                Text("Recent Published Media & Activity")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.manaTextPrimary)

                VStack(alignment: .leading, spacing: 8) {
                    HStack(spacing: 10) {
                        ZStack {
                            RoundedRectangle(cornerRadius: 8)
                                .fill(Color.purple.opacity(0.3))
                                .frame(width: 44, height: 44)
                            Image(systemName: "heart.fill")
                                .foregroundColor(.pink)
                        }

                        VStack(alignment: .leading, spacing: 2) {
                            Text("💛✨ Connecting Bonds, Celebrating Ties...")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.manaTextPrimary)
                                .lineLimit(1)
                            HStack(spacing: 8) {
                                Text("♥ 5 Likes")
                                Text("💬 0 Comments")
                                Text("9/8/2025")
                            }
                            .font(.system(size: 10))
                            .foregroundColor(.manaTextSecondary)
                        }
                    }
                }
                .padding(12)
                .background(Color.manaBackground)
                .cornerRadius(10)
            }
            .padding(14)
            .background(Color.manaSurfaceDark)
            .cornerRadius(14)
            .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.manaBorder, lineWidth: 1))
        }
    }
}

// MARK: - Sub Component Cards
struct InsightCard: View {
    let title: String
    let value: String
    let subtitle: String
    let color: Color
    let icon: String

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(title)
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(.manaTextSecondary)
                Spacer()
                Image(systemName: icon)
                    .font(.system(size: 12))
                    .foregroundColor(color)
            }
            Text(value)
                .font(.system(size: 18, weight: .black))
                .foregroundColor(.manaTextPrimary)
            Text(subtitle)
                .font(.system(size: 9))
                .foregroundColor(.manaTextSecondary)
        }
        .padding(12)
        .background(Color.manaSurfaceDark)
        .cornerRadius(12)
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.manaBorder, lineWidth: 1))
    }
}

// MARK: - Facebook Hub View
struct FacebookHubContentView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "hand.thumbsup.fill")
                    .foregroundColor(.blue)
                Text("Facebook Page & Messenger DMs")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.manaTextPrimary)
            }
            Text("Auto-reply to customer comments, page messages, and Messenger inquiries.")
                .font(.system(size: 12))
                .foregroundColor(.manaTextSecondary)
        }
        .padding(16)
        .background(Color.manaSurfaceDark)
        .cornerRadius(16)
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.manaBorder, lineWidth: 1))
    }
}

// MARK: - Google SEO View
struct GoogleSeoContentView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "globe")
                    .foregroundColor(.manaTeal)
                Text("Google SEO & Maps Profile")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.manaTextPrimary)
            }
            Text("Monitor your Google Business Profile (GBP) local map pack ranking in Tirupati.")
                .font(.system(size: 12))
                .foregroundColor(.manaTextSecondary)
        }
        .padding(16)
        .background(Color.manaSurfaceDark)
        .cornerRadius(16)
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.manaBorder, lineWidth: 1))
    }
}

// MARK: - Asset Library View
struct AssetLibraryContentView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "folder.fill")
                    .foregroundColor(.orange)
                Text("Media & Asset Library")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.manaTextPrimary)
            }
            Text("Store business banners, promotional graphics, and video ads.")
                .font(.system(size: 12))
                .foregroundColor(.manaTextSecondary)
        }
        .padding(16)
        .background(Color.manaSurfaceDark)
        .cornerRadius(16)
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.manaBorder, lineWidth: 1))
    }
}

// MARK: - Meta Ads Manager View
struct MetaAdsManagerContentView: View {
    @Binding var adObjective: String
    @Binding var dailyBudget: String
    @Binding var targetAudience: String

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Image(systemName: "megaphone.fill")
                    .foregroundColor(.blue)
                Text("Meta Ads Campaign Builder")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.manaTextPrimary)
            }

            CustomFormField(label: "Campaign Objective", placeholder: "Lead Generation", text: $adObjective)
            CustomFormField(label: "Daily Budget (₹)", placeholder: "500", text: $dailyBudget)
            CustomFormField(label: "Target Audience", placeholder: "Tirupati Local", text: $targetAudience)

            Button(action: {}) {
                Text("Launch Automated Meta Campaign")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(Color.blue)
                    .cornerRadius(12)
            }
        }
        .padding(16)
        .background(Color.manaSurfaceDark)
        .cornerRadius(16)
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.manaBorder, lineWidth: 1))
    }
}
