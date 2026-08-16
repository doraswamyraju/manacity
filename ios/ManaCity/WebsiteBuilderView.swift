import SwiftUI

struct WebsiteBuilderView: View {
    @State private var heroTitle: String = "Top Verified Business in Tirupati"
    @State private var heroSubtitle: String = "Get instant quotes, phone calls, and direct direction on ManaCity."
    @State private var themeColor: Color = .manaViolet

    @State private var showHeaderSection: Bool = true
    @State private var showHeroSection: Bool = true
    @State private var showServicesSection: Bool = true
    @State private var showReviewsSection: Bool = true
    @State private var showContactSection: Bool = true

    @State private var isSaved: Bool = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                // Header Banner
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Smart Website Builder")
                            .font(.system(size: 18, weight: .black))
                            .foregroundColor(.white)
                        Text("Customize your business landing page sections and live theme.")
                            .font(.system(size: 12))
                            .foregroundColor(.white.opacity(0.85))
                    }
                    Spacer()
                    Image(systemName: "paintbrush.fill")
                        .font(.system(size: 32))
                        .foregroundColor(.white.opacity(0.8))
                }
                .padding(16)
                .background(LinearGradient(colors: [.manaViolet, .purple], startPoint: .topLeading, endPoint: .bottomTrailing))
                .cornerRadius(16)

                if isSaved {
                    HStack {
                        Image(systemName: "checkmark.circle.fill").foregroundColor(.green)
                        Text("Website sections saved & published!").font(.system(size: 13, weight: .bold)).foregroundColor(.green)
                    }
                    .padding(12)
                    .background(Color.green.opacity(0.12))
                    .cornerRadius(10)
                }

                // Hero Section Content
                VStack(alignment: .leading, spacing: 12) {
                    Text("Hero Header Content")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.manaTextPrimary)

                    CustomFormField(label: "Main Headline", placeholder: "e.g. Best Digital Agency", text: $heroTitle)
                    CustomFormField(label: "Subtitle Description", placeholder: "e.g. 100% Verified Services", text: $heroSubtitle)
                }
                .padding(14)
                .background(Color.manaSurfaceDark)
                .cornerRadius(14)

                // Section Visibility Controls
                VStack(alignment: .leading, spacing: 12) {
                    Text("Website Sections & Display Toggles")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.manaTextPrimary)

                    Toggle("Header Navigation", isOn: $showHeaderSection)
                        .font(.system(size: 14))
                    Toggle("Hero Banner", isOn: $showHeroSection)
                        .font(.system(size: 14))
                    Toggle("Products & Services", isOn: $showServicesSection)
                        .font(.system(size: 14))
                    Toggle("Customer Reviews", isOn: $showReviewsSection)
                        .font(.system(size: 14))
                    Toggle("Contact & Quote Form", isOn: $showContactSection)
                        .font(.system(size: 14))
                }
                .padding(14)
                .background(Color.manaSurfaceDark)
                .cornerRadius(14)

                // Live Preview Card
                VStack(alignment: .leading, spacing: 10) {
                    Text("Live Mobile Website Preview")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.manaTextPrimary)

                    VStack(alignment: .leading, spacing: 10) {
                        Text(heroTitle)
                            .font(.system(size: 16, weight: .black))
                            .foregroundColor(.white)
                        Text(heroSubtitle)
                            .font(.system(size: 12))
                            .foregroundColor(.white.opacity(0.85))
                    }
                    .padding(16)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(themeColor)
                    .cornerRadius(12)
                }
                .padding(14)
                .background(Color.manaSurfaceDark)
                .cornerRadius(14)

                Button(action: {
                    isSaved = true
                }) {
                    HStack {
                        Image(systemName: "globe")
                        Text("Publish Website Changes")
                    }
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(Color.manaViolet)
                    .cornerRadius(12)
                }
                .padding(.bottom, 24)
            }
            .padding(16)
        }
        .background(Color.manaBackground.ignoresSafeArea())
    }
}
