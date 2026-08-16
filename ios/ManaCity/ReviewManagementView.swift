import SwiftUI

struct ReviewManagementView: View {
    @State private var googleReviewUrl: String = "https://g.page/r/manacity-tirupati/review"
    @State private var ratingThreshold: Int = 4
    @State private var welcomeMessage: String = "How was your experience with us today?"
    @State private var isSaving: Bool = false
    @State private var showSaveSuccess: Bool = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                // Header Banner
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Google Reviews & QR Generator")
                            .font(.system(size: 18, weight: .black))
                            .foregroundColor(.white)
                        Text("Get 5-Star Google Reviews automatically with table stand QR codes.")
                            .font(.system(size: 12))
                            .foregroundColor(.white.opacity(0.85))
                    }
                    Spacer()
                    Image(systemName: "qrcode")
                        .font(.system(size: 40))
                        .foregroundColor(.white.opacity(0.8))
                }
                .padding(16)
                .background(LinearGradient(colors: [.manaViolet, .manaTeal], startPoint: .topLeading, endPoint: .bottomTrailing))
                .cornerRadius(16)

                if showSaveSuccess {
                    HStack {
                        Image(systemName: "checkmark.circle.fill").foregroundColor(.green)
                        Text("Review settings updated successfully!").font(.system(size: 13, weight: .bold)).foregroundColor(.green)
                    }
                    .padding(12)
                    .background(Color.green.opacity(0.12))
                    .cornerRadius(10)
                }

                // Google Review URL Setup
                VStack(alignment: .leading, spacing: 10) {
                    Text("1. Google Review URL")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.manaTextPrimary)

                    TextField("https://g.page/r/your-business/review", text: $googleReviewUrl)
                        .font(.system(size: 13))
                        .foregroundColor(.manaTextPrimary)
                        .padding(12)
                        .background(Color.manaSurfaceDark)
                        .cornerRadius(10)
                        .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.manaBorder, lineWidth: 1))
                }
                .padding(14)
                .background(Color.manaSurfaceDark)
                .cornerRadius(14)

                // Rating Threshold Filter
                VStack(alignment: .leading, spacing: 10) {
                    Text("2. Smart Rating Filter")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.manaTextPrimary)

                    Text("Customers rating \(ratingThreshold)+ stars are directed to Google Reviews. Ratings below \(ratingThreshold) stars send private feedback to you.")
                        .font(.system(size: 12))
                        .foregroundColor(.manaTextSecondary)

                    Stepper("Threshold: \(ratingThreshold) Stars", value: $ratingThreshold, in: 3...5)
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.manaViolet)
                }
                .padding(14)
                .background(Color.manaSurfaceDark)
                .cornerRadius(14)

                // QR Code Poster Preview Card
                VStack(alignment: .center, spacing: 12) {
                    Text("Printable QR Table Stand Preview")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.manaTextPrimary)

                    VStack(spacing: 12) {
                        ManaLogoView(type: .square, height: 40)
                        Text("Scan to Review Us on Google")
                            .font(.system(size: 14, weight: .black))
                            .foregroundColor(.manaTextPrimary)

                        ZStack {
                            RoundedRectangle(cornerRadius: 12)
                                .fill(Color.white)
                                .frame(width: 140, height: 140)
                                .shadow(radius: 4)
                            Image(systemName: "qrcode")
                                .font(.system(size: 100))
                                .foregroundColor(.black)
                        }

                        Text("Thank you for choosing us!")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(.manaTextSecondary)
                    }
                    .padding(16)
                    .frame(maxWidth: .infinity)
                    .background(Color.white)
                    .cornerRadius(16)
                    .shadow(color: Color.black.opacity(0.1), radius: 6, y: 3)
                }
                .padding(14)
                .background(Color.manaSurfaceDark)
                .cornerRadius(14)

                Button(action: {
                    showSaveSuccess = true
                }) {
                    HStack {
                        Image(systemName: "square.and.arrow.down.fill")
                        Text("Save & Update Review QR")
                    }
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(LinearGradient(colors: [.manaViolet, .manaTeal], startPoint: .leading, endPoint: .trailing))
                    .cornerRadius(12)
                }
                .padding(.bottom, 24)
            }
            .padding(16)
        }
        .background(Color.manaBackground.ignoresSafeArea())
    }
}
