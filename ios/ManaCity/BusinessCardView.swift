import SwiftUI

struct BusinessCardView: View {
    let business: Business
    let onSelect: (Business) -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Top Banner with Category, Rating, and Verified Badges
            ZStack(alignment: .top) {
                if let cover = business.coverImage, !cover.isEmpty, let url = URL(string: cover) {
                    AsyncImage(url: url) { phase in
                        switch phase {
                        case .success(let img):
                            img.resizable().aspectRatio(contentMode: .fill)
                        default:
                            defaultCoverBanner
                        }
                    }
                    .frame(width: 260, height: 115)
                    .clipped()
                } else {
                    defaultCoverBanner
                }

                HStack {
                    Text(business.category)
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.blue)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.white)
                        .cornerRadius(12)

                    Spacer()

                    HStack(spacing: 3) {
                        Image(systemName: "star.fill")
                            .font(.system(size: 9))
                            .foregroundColor(.yellow)
                        Text(String(format: "%.1f", business.rating))
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 7)
                    .padding(.vertical, 4)
                    .background(Color.black.opacity(0.65))
                    .cornerRadius(12)
                }
                .padding(10)
            }
            .frame(width: 260, height: 115)

            // Overlapping Logo Avatar & Details
            VStack(alignment: .leading, spacing: 10) {
                HStack(alignment: .bottom) {
                    ZStack(alignment: .bottomTrailing) {
                        if let logo = business.logoUrl, !logo.isEmpty, let url = URL(string: logo) {
                            AsyncImage(url: url) { phase in
                                switch phase {
                                case .success(let img):
                                    img.resizable().aspectRatio(contentMode: .fill)
                                default:
                                    initialLogoBadge
                                }
                            }
                            .frame(width: 52, height: 52)
                            .clipShape(Circle())
                            .overlay(Circle().stroke(Color.white, lineWidth: 2.5))
                            .shadow(color: Color.black.opacity(0.15), radius: 4, y: 2)
                        } else {
                            initialLogoBadge
                        }

                        if business.isVerified {
                            Image(systemName: "checkmark.seal.fill")
                                .font(.system(size: 15))
                                .foregroundColor(.green)
                                .background(Circle().fill(Color.white))
                                .offset(x: 2, y: 2)
                        }
                    }
                    .offset(y: -22)

                    Spacer()

                    // Verified / Unverified Badge
                    if business.isVerified {
                        HStack(spacing: 3) {
                            Image(systemName: "checkmark.shield.fill")
                                .font(.system(size: 10))
                            Text("Verified")
                                .font(.system(size: 10, weight: .bold))
                        }
                        .foregroundColor(.green)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(Color.green.opacity(0.12))
                        .cornerRadius(10)
                    } else {
                        Text("Unverified")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.orange)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(Color.orange.opacity(0.12))
                            .cornerRadius(10)
                    }
                }
                .frame(height: 30)

                Button(action: { onSelect(business) }) {
                    Text(business.name)
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                        .lineLimit(1)
                }

                Text(business.address)
                    .font(.system(size: 11))
                    .foregroundColor(.manaTextSecondary)
                    .lineLimit(2)

                // Call, WhatsApp & Get Quote Action Buttons
                HStack(spacing: 6) {
                    Button(action: {
                        if let phoneUrl = URL(string: "tel://\(business.phone.replacingOccurrences(of: " ", with: ""))") {
                            UIApplication.shared.open(phoneUrl)
                        }
                    }) {
                        HStack(spacing: 4) {
                            Image(systemName: "phone.fill")
                                .font(.system(size: 10))
                            Text("Call")
                                .font(.system(size: 11, weight: .bold))
                        }
                        .foregroundColor(.white)
                        .padding(.vertical, 6)
                        .frame(maxWidth: .infinity)
                        .background(Color.green)
                        .cornerRadius(8)
                    }

                    Button(action: {
                        if let waUrl = URL(string: "https://wa.me/\(business.phone.replacingOccurrences(of: " ", with: "").replacingOccurrences(of: "+", with: ""))") {
                            UIApplication.shared.open(waUrl)
                        }
                    }) {
                        HStack(spacing: 4) {
                            Image(systemName: "message.fill")
                                .font(.system(size: 10))
                            Text("WhatsApp")
                                .font(.system(size: 11, weight: .bold))
                        }
                        .foregroundColor(.white)
                        .padding(.vertical, 6)
                        .frame(maxWidth: .infinity)
                        .background(Color(red: 0.15, green: 0.83, blue: 0.40))
                        .cornerRadius(8)
                    }
                }

                Button(action: { onSelect(business) }) {
                    HStack(spacing: 4) {
                        Image(systemName: "bolt.fill")
                            .font(.system(size: 11))
                        Text("Get Best Quote")
                            .font(.system(size: 11, weight: .bold))
                    }
                    .foregroundColor(.manaViolet)
                    .padding(.vertical, 6)
                    .frame(maxWidth: .infinity)
                    .background(Color.manaViolet.opacity(0.12))
                    .cornerRadius(8)
                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.manaViolet.opacity(0.3), lineWidth: 1))
                }
            }
            .padding(12)
        }
        .frame(width: 260)
        .background(Color.manaSurfaceDark)
        .cornerRadius(18)
        .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color.manaBorder, lineWidth: 1.5))
    }

    private var defaultCoverBanner: some View {
        ZStack {
            LinearGradient(colors: [Color.manaViolet.opacity(0.85), Color.blue.opacity(0.85)], startPoint: .topLeading, endPoint: .bottomTrailing)
            Image(systemName: business.category.contains("Clinic") ? "cross.case.fill" : business.category.contains("Digital") ? "laptopcomputer" : "building.2.fill")
                .font(.system(size: 45))
                .foregroundColor(.white.opacity(0.25))
        }
        .frame(width: 260, height: 115)
        .clipped()
    }

    private var initialLogoBadge: some View {
        Circle()
            .fill(LinearGradient(colors: [.manaTeal.opacity(0.2), .manaViolet.opacity(0.2)], startPoint: .topLeading, endPoint: .bottomTrailing))
            .frame(width: 52, height: 52)
            .overlay(
                Text(business.name.prefix(2).uppercased())
                    .font(.system(size: 18, weight: .black))
                    .foregroundColor(.manaTeal)
            )
            .overlay(Circle().stroke(Color.white, lineWidth: 2.5))
            .shadow(color: Color.black.opacity(0.15), radius: 4, y: 2)
    }
}
