import SwiftUI

struct PublicBusinessWebsiteView: View {
    let business: Business
    let onClose: () -> Void

    @State private var customerName: String = ""
    @State private var customerPhone: String = ""
    @State private var message: String = ""
    @State private var isSubmitting: Bool = false
    @State private var showSuccessMessage: Bool = false

    var body: some View {
        VStack(spacing: 0) {
            // MARK: - Header
            HStack {
                Button(action: onClose) {
                    Image(systemName: "xmark")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                        .padding(8)
                        .background(Color.manaSurfaceDark)
                        .clipShape(Circle())
                }

                Spacer()

                HStack(spacing: 6) {
                    if let logo = business.logoUrl, !logo.isEmpty, let url = URL(string: logo) {
                        AsyncImage(url: url) { img in
                            img.resizable().aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Circle().fill(Color.manaViolet.opacity(0.2))
                        }
                        .frame(width: 24, height: 24)
                        .clipShape(Circle())
                    }
                    Text(business.name)
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                }

                Spacer()

                Button(action: {
                    if let phoneUrl = URL(string: "tel://\(business.phone.replacingOccurrences(of: " ", with: ""))") {
                        UIApplication.shared.open(phoneUrl)
                    }
                }) {
                    Image(systemName: "phone.fill")
                        .font(.system(size: 14))
                        .foregroundColor(.white)
                        .padding(8)
                        .background(Color.green)
                        .clipShape(Circle())
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(Color.manaSurfaceDark)

            // MARK: - Website Body Scroll
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Cover Photo & Overlapping Badge
                    ZStack(alignment: .bottomLeading) {
                        if let cover = business.coverImage, !cover.isEmpty, let url = URL(string: cover) {
                            AsyncImage(url: url) { img in
                                img.resizable().aspectRatio(contentMode: .fill)
                            } placeholder: {
                                LinearGradient(colors: [.manaViolet, .blue], startPoint: .topLeading, endPoint: .bottomTrailing)
                            }
                            .frame(height: 180)
                            .clipped()
                        } else {
                            LinearGradient(colors: [.manaViolet, .blue], startPoint: .topLeading, endPoint: .bottomTrailing)
                                .frame(height: 180)
                        }

                        // Gradient Overlay
                        LinearGradient(colors: [.clear, .black.opacity(0.7)], startPoint: .top, endPoint: .bottom)

                        VStack(alignment: .leading, spacing: 4) {
                            HStack(spacing: 6) {
                                Text(business.category)
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(Color.blue)
                                    .cornerRadius(12)

                                if business.isVerified {
                                    HStack(spacing: 3) {
                                        Image(systemName: "checkmark.shield.fill")
                                            .font(.system(size: 10))
                                        Text("Verified")
                                            .font(.system(size: 10, weight: .bold))
                                    }
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(Color.green)
                                    .cornerRadius(12)
                                }
                            }

                            Text(business.name)
                                .font(.system(size: 22, weight: .black))
                                .foregroundColor(.white)

                            HStack(spacing: 8) {
                                HStack(spacing: 3) {
                                    Image(systemName: "star.fill").foregroundColor(.yellow).font(.system(size: 11))
                                    Text(String(format: "%.1f", business.rating)).font(.system(size: 12, weight: .bold)).foregroundColor(.white)
                                    Text("(\(business.reviewCount) Reviews)").font(.system(size: 11)).foregroundColor(.white.opacity(0.8))
                                }
                                Text("•").foregroundColor(.white.opacity(0.6))
                                Text(business.city).font(.system(size: 12)).foregroundColor(.white.opacity(0.9))
                            }
                        }
                        .padding(16)
                    }

                    // Quick Action Contact Bar
                    HStack(spacing: 10) {
                        Button(action: {
                            if let phoneUrl = URL(string: "tel://\(business.phone.replacingOccurrences(of: " ", with: ""))") {
                                UIApplication.shared.open(phoneUrl)
                            }
                        }) {
                            HStack {
                                Image(systemName: "phone.fill")
                                Text("Call Now")
                            }
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 10)
                            .background(Color.green)
                            .cornerRadius(10)
                        }

                        Button(action: {
                            if let waUrl = URL(string: "https://wa.me/\(business.phone.replacingOccurrences(of: " ", with: "").replacingOccurrences(of: "+", with: ""))") {
                                UIApplication.shared.open(waUrl)
                            }
                        }) {
                            HStack {
                                Image(systemName: "message.fill")
                                Text("WhatsApp")
                            }
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 10)
                            .background(Color(red: 0.15, green: 0.83, blue: 0.40))
                            .cornerRadius(10)
                        }
                    }
                    .padding(.horizontal, 16)

                    // Address & Info Card
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Address & Location")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.manaTextPrimary)

                        HStack(alignment: .top, spacing: 10) {
                            Image(systemName: "mappin.circle.fill")
                                .font(.system(size: 18))
                                .foregroundColor(.manaViolet)
                            VStack(alignment: .leading, spacing: 2) {
                                Text(business.address)
                                    .font(.system(size: 13))
                                    .foregroundColor(.manaTextPrimary)
                                Text("Tirupati, Andhra Pradesh")
                                    .font(.system(size: 12))
                                    .foregroundColor(.manaTextSecondary)
                            }
                        }
                    }
                    .padding(14)
                    .background(Color.manaSurfaceDark)
                    .cornerRadius(14)
                    .padding(.horizontal, 16)

                    // Services & Products
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Products & Services Offered")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.manaTextPrimary)

                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                            ForEach(["SEO Optimization", "Google Ads", "GBP Management", "Meta Ads", "Website Design"], id: \.self) { svc in
                                HStack {
                                    Image(systemName: "checkmark.circle.fill")
                                        .foregroundColor(.manaViolet)
                                        .font(.system(size: 12))
                                    Text(svc)
                                        .font(.system(size: 12, weight: .semibold))
                                        .foregroundColor(.manaTextPrimary)
                                    Spacer()
                                }
                                .padding(10)
                                .background(Color.manaSurfaceDark)
                                .cornerRadius(8)
                            }
                        }
                    }
                    .padding(.horizontal, 16)

                    // Send Inquiry Form
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Get Best Price Quote")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.manaTextPrimary)

                        if showSuccessMessage {
                            HStack {
                                Image(systemName: "checkmark.circle.fill").foregroundColor(.green)
                                Text("Inquiry sent successfully! Business owner will call you shortly.").font(.system(size: 13, weight: .bold)).foregroundColor(.green)
                            }
                            .padding(12)
                            .background(Color.green.opacity(0.12))
                            .cornerRadius(10)
                        } else {
                            TextField("Your Name", text: $customerName)
                                .font(.system(size: 13))
                                .padding(10)
                                .background(Color.manaSurfaceDark)
                                .cornerRadius(8)

                            TextField("Your Phone Number", text: $customerPhone)
                                .font(.system(size: 13))
                                .padding(10)
                                .background(Color.manaSurfaceDark)
                                .cornerRadius(8)

                            Button(action: {
                                showSuccessMessage = true
                            }) {
                                HStack {
                                    Image(systemName: "bolt.fill")
                                    Text("Send Instant Inquiry")
                                }
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 10)
                                .background(Color.manaViolet)
                                .cornerRadius(8)
                            }
                        }
                    }
                    .padding(14)
                    .background(Color.manaSurfaceDark)
                    .cornerRadius(14)
                    .padding(.horizontal, 16)
                    .padding(.bottom, 24)
                }
            }
        }
        .background(Color.manaBackground.ignoresSafeArea())
    }
}
