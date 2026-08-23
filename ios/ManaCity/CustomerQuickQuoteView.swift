import SwiftUI

struct CustomerQuickQuoteView: View {
    @State private var selectedCategory: String = "Digital Marketing"
    @State private var customerName: String = ""
    @State private var customerPhone: String = ""
    @State private var serviceDetails: String = ""
    @State private var selectedCity: String = "Tirupati"
    @State private var isSubmitting: Bool = false
    @State private var isSubmitted: Bool = false

    let categories = [
        "Digital Marketing",
        "CA & Tax Consultants",
        "Taxi & Car Rentals",
        "Doctors & Clinics",
        "Real Estate & Villas",
        "AC & Electrician Repairs",
        "Restaurants & Catering"
    ]

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 20) {
                // Header Banner
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Image(systemName: "bolt.shield.fill")
                            .font(.system(size: 24))
                            .foregroundColor(.manaViolet)
                        Text("Get Best Vendor Quotes")
                            .font(.system(size: 22, weight: .black))
                            .foregroundColor(.manaTextPrimary)
                    }

                    Text("Submit one enquiry and receive competitive direct quotes from top 100% verified vendors in \(selectedCity) within 15 minutes.")
                        .font(.system(size: 13))
                        .foregroundColor(.manaTextSecondary)
                        .lineSpacing(3)
                }
                .padding(16)
                .background(Color.manaViolet.opacity(0.1))
                .cornerRadius(18)
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color.manaViolet.opacity(0.25), lineWidth: 1.5))

                if isSubmitted {
                    VStack(spacing: 14) {
                        Image(systemName: "checkmark.seal.fill")
                            .font(.system(size: 54))
                            .foregroundColor(.green)

                        Text("Quote Request Broadcasted!")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.manaTextPrimary)

                        Text("Top verified \(selectedCategory) providers in \(selectedCity) will contact you directly via WhatsApp & Phone within 15 minutes.")
                            .font(.system(size: 13))
                            .foregroundColor(.manaTextSecondary)
                            .multilineTextAlignment(.center)
                            .lineSpacing(3)

                        Button(action: {
                            isSubmitted = false
                            customerName = ""
                            customerPhone = ""
                            serviceDetails = ""
                        }) {
                            Text("Submit Another Quote Request")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(.manaViolet)
                                .padding(.horizontal, 20)
                                .padding(.vertical, 10)
                                .background(Color.manaViolet.opacity(0.12))
                                .cornerRadius(12)
                        }
                    }
                    .padding(24)
                    .frame(maxWidth: .infinity)
                    .background(Color.manaSurfaceDark)
                    .cornerRadius(20)
                } else {
                    // Form Fields
                    VStack(alignment: .leading, spacing: 16) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Select Required Category")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(.manaTextPrimary)

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 8) {
                                    ForEach(categories, id: \.self) { cat in
                                        Button(action: { selectedCategory = cat }) {
                                            Text(cat)
                                                .font(.system(size: 12, weight: .bold))
                                                .foregroundColor(selectedCategory == cat ? .white : .manaTextSecondary)
                                                .padding(.horizontal, 14)
                                                .padding(.vertical, 8)
                                                .background(selectedCategory == cat ? Color.manaViolet : Color.manaSurfaceDark)
                                                .cornerRadius(12)
                                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.manaBorder, lineWidth: 1))
                                        }
                                    }
                                }
                            }
                        }

                        CustomFormField(label: "Your Full Name *", placeholder: "e.g. Raju Meesala", text: $customerName)
                        CustomFormField(label: "10-Digit Mobile Number *", placeholder: "e.g. 9876543210", text: $customerPhone)
                        CustomFormField(label: "Specific Requirements / Questions", placeholder: "What service or pricing details are you looking for?", text: $serviceDetails)

                        Button(action: submitQuickQuote) {
                            HStack {
                                if isSubmitting {
                                    ProgressView().tint(.white)
                                } else {
                                    Image(systemName: "paperplane.fill")
                                    Text("Broadcast Quote Request (15-Min SLA)")
                                }
                            }
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(Color.manaViolet)
                            .cornerRadius(14)
                            .shadow(color: Color.manaViolet.opacity(0.3), radius: 8, y: 4)
                        }
                        .disabled(isSubmitting || customerPhone.isEmpty)
                    }
                    .padding(18)
                    .background(Color.manaSurfaceDark)
                    .cornerRadius(20)
                    .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color.manaBorder, lineWidth: 1))
                }
            }
            .padding(16)
        }
        .background(Color.manaBackground.ignoresSafeArea())
    }

    private func submitQuickQuote() {
        guard !customerPhone.isEmpty else { return }
        isSubmitting = true

        guard let url = URL(string: "https://manacity.in/api/phase1/lead-capture") else { return }
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body: [String: Any] = [
            "businessId": "broadcast_\(selectedCategory.lowercased())",
            "businessName": "\(selectedCategory) Vendor Broadcast",
            "customerName": customerName.isEmpty ? "Valued Customer" : customerName,
            "customerPhone": customerPhone,
            "customerMessage": serviceDetails.isEmpty ? "Requesting quotes for \(selectedCategory) in \(selectedCity)" : serviceDetails,
            "city": selectedCity
        ]

        req.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: req) { _, _, _ in
            DispatchQueue.main.async {
                self.isSubmitting = false
                self.isSubmitted = true
            }
        }.resume()
    }
}
