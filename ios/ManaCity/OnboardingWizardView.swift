import SwiftUI

struct OnboardingWizardView: View {
    let onComplete: () -> Void
    let onCancel: () -> Void

    @State private var currentStep: Int = 1

    // Step 1: Business Information
    @State private var businessName: String = ""
    @State private var category: String = "Digital Marketing"
    @State private var description: String = ""
    @State private var logoUrl: String = ""
    @State private var coverImageUrl: String = ""

    // Step 2: Contact Details
    @State private var mobileNumber: String = ""
    @State private var whatsAppNumber: String = ""
    @State private var email: String = ""
    @State private var website: String = ""

    // Step 3: Address
    @State private var city: String = "Tirupati"
    @State private var areaLocality: String = "Bairagi Patteda"
    @State private var fullAddress: String = ""
    @State private var googleMapsLink: String = ""

    // Step 4: Products & Services
    @State private var newService: String = ""
    @State private var servicesList: [String] = ["SEO Optimization", "Google Ads", "Social Media Marketing"]

    // Step 5: Subdomain / Domain
    @State private var subdomain: String = ""
    @State private var customDomain: String = ""

    @State private var isSubmitting: Bool = false
    @State private var errorMessage: String? = nil

    let categories = ["Digital Marketing", "Clinics & Health", "Restaurants & Food", "Services & Repairs", "Education & Coaching", "Retail & Shopping"]

    var body: some View {
        VStack(spacing: 0) {
            // MARK: - Header
            HStack {
                Button(action: onCancel) {
                    Image(systemName: "xmark")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                        .padding(8)
                        .background(Color.manaSurfaceDark)
                        .clipShape(Circle())
                }

                Spacer()

                Text("Business Onboarding")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.manaTextPrimary)

                Spacer()

                Text("Step \(currentStep)/6")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(.manaViolet)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(Color.manaViolet.opacity(0.12))
                    .cornerRadius(12)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color.manaSurfaceDark)

            // MARK: - Step Progress Indicator Bar
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Rectangle()
                        .fill(Color.manaBorder)
                        .frame(height: 4)
                    Rectangle()
                        .fill(LinearGradient(colors: [.manaViolet, .manaTeal], startPoint: .leading, endPoint: .trailing))
                        .frame(width: geo.size.width * (CGFloat(currentStep) / 6.0), height: 4)
                }
            }
            .frame(height: 4)

            // MARK: - Scrollable Step Content
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    if let err = errorMessage {
                        HStack {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .foregroundColor(.red)
                            Text(err)
                                .font(.system(size: 13, weight: .medium))
                                .foregroundColor(.red)
                        }
                        .padding(12)
                        .background(Color.red.opacity(0.1))
                        .cornerRadius(10)
                    }

                    if currentStep == 1 {
                        step1BusinessInfoView
                    } else if currentStep == 2 {
                        step2ContactView
                    } else if currentStep == 3 {
                        step3AddressView
                    } else if currentStep == 4 {
                        step4ServicesView
                    } else if currentStep == 5 {
                        step5WebsiteView
                    } else {
                        step6LaunchView
                    }
                }
                .padding(16)
            }

            // MARK: - Navigation Control Footer
            HStack(spacing: 12) {
                if currentStep > 1 {
                    Button(action: { currentStep -= 1 }) {
                        Text("Back")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.manaTextPrimary)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color.manaSurfaceDark)
                            .cornerRadius(12)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.manaBorder, lineWidth: 1))
                    }
                }

                Button(action: {
                    if currentStep < 6 {
                        if validateStep() {
                            currentStep += 1
                        }
                    } else {
                        submitOnboarding()
                    }
                }) {
                    HStack {
                        if isSubmitting {
                            ProgressView().tint(.white)
                        } else {
                            Text(currentStep == 6 ? "Launch My Business Website" : "Continue")
                                .font(.system(size: 14, weight: .bold))
                            Image(systemName: currentStep == 6 ? "rocket.fill" : "arrow.right")
                                .font(.system(size: 13, weight: .bold))
                        }
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(LinearGradient(colors: [.manaViolet, .manaTeal], startPoint: .leading, endPoint: .trailing))
                    .cornerRadius(12)
                }
                .disabled(isSubmitting)
            }
            .padding(16)
            .background(Color.manaSurfaceDark)
        }
        .background(Color.manaBackground.ignoresSafeArea())
    }

    // MARK: - Step 1: Business Profile
    private var step1BusinessInfoView: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Step 1: Business Profile")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(.manaTextPrimary)
            Text("Tell customers about your business, logo, and cover photo.")
                .font(.system(size: 13))
                .foregroundColor(.manaTextSecondary)

            CustomFormField(label: "Business Name", placeholder: "e.g. Rajugari Ventures", text: $businessName)

            VStack(alignment: .leading, spacing: 6) {
                Text("Category")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(.manaTextPrimary)
                Picker("Category", selection: $category) {
                    ForEach(categories, id: \.self) { cat in
                        Text(cat).tag(cat)
                    }
                }
                .pickerStyle(.menu)
                .padding(10)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color.manaSurfaceDark)
                .cornerRadius(10)
                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.manaBorder, lineWidth: 1))
            }

            CustomFormField(label: "Short Description", placeholder: "e.g. Top digital marketing agency in Tirupati", text: $description)

            CustomFormField(label: "Logo Image URL (Optional)", placeholder: "https://example.com/logo.png", text: $logoUrl)

            CustomFormField(label: "Cover Banner Image URL (Optional)", placeholder: "https://example.com/banner.jpg", text: $coverImageUrl)
        }
    }

    // MARK: - Step 2: Contact Information
    private var step2ContactView: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Step 2: Contact & Leads")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(.manaTextPrimary)
            Text("How customers can reach your business directly via Phone and WhatsApp.")
                .font(.system(size: 13))
                .foregroundColor(.manaTextSecondary)

            CustomFormField(label: "Mobile Number", placeholder: "+91 9876543210", text: $mobileNumber)
            CustomFormField(label: "WhatsApp Number", placeholder: "+91 9876543210", text: $whatsAppNumber)
            CustomFormField(label: "Email Address", placeholder: "contact@mybusiness.com", text: $email)
            CustomFormField(label: "Existing Website (Optional)", placeholder: "https://mybusiness.com", text: $website)
        }
    }

    // MARK: - Step 3: Address & Location
    private var step3AddressView: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Step 3: Business Location")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(.manaTextPrimary)
            Text("Help customers in Tirupati locate your store or clinic.")
                .font(.system(size: 13))
                .foregroundColor(.manaTextSecondary)

            CustomFormField(label: "City", placeholder: "Tirupati", text: $city)
            CustomFormField(label: "Area / Locality", placeholder: "Bairagi Patteda / Tata Nagar", text: $areaLocality)
            CustomFormField(label: "Full Street Address", placeholder: "Door No. 12-34, Main Road...", text: $fullAddress)
            CustomFormField(label: "Google Maps Link", placeholder: "https://maps.app.goo.gl/...", text: $googleMapsLink)
        }
    }

    // MARK: - Step 4: Products & Services
    private var step4ServicesView: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Step 4: Products & Services")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(.manaTextPrimary)
            Text("Add key services customers search for.")
                .font(.system(size: 13))
                .foregroundColor(.manaTextSecondary)

            HStack {
                TextField("Add service (e.g. SEO Optimization)", text: $newService)
                    .font(.system(size: 14))
                    .padding(12)
                    .background(Color.manaSurfaceDark)
                    .cornerRadius(10)
                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.manaBorder, lineWidth: 1))

                Button(action: {
                    if !newService.trimmingCharacters(in: .whitespaces).isEmpty {
                        servicesList.append(newService.trimmingCharacters(in: .whitespaces))
                        newService = ""
                    }
                }) {
                    Image(systemName: "plus")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.white)
                        .padding(12)
                        .background(Color.manaViolet)
                        .cornerRadius(10)
                }
            }

            VStack(alignment: .leading, spacing: 8) {
                ForEach(servicesList, id: \.self) { item in
                    HStack {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(.green)
                        Text(item)
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.manaTextPrimary)
                        Spacer()
                        Button(action: {
                            servicesList.removeAll(where: { $0 == item })
                        }) {
                            Image(systemName: "trash")
                                .font(.system(size: 13))
                                .foregroundColor(.red)
                        }
                    }
                    .padding(10)
                    .background(Color.manaSurfaceDark)
                    .cornerRadius(10)
                }
            }
        }
    }

    // MARK: - Step 5: Subdomain & Website Domain
    private var step5WebsiteView: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Step 5: Smart Website Link")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(.manaTextPrimary)
            Text("Choose your free ManaCity smart subdomain URL.")
                .font(.system(size: 13))
                .foregroundColor(.manaTextSecondary)

            VStack(alignment: .leading, spacing: 6) {
                Text("Subdomain Name")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(.manaTextPrimary)
                HStack(spacing: 0) {
                    TextField("mybusiness", text: $subdomain)
                        .font(.system(size: 14))
                        .autocapitalization(.none)
                    Text(".manacity.in")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.manaViolet)
                }
                .padding(12)
                .background(Color.manaSurfaceDark)
                .cornerRadius(10)
                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.manaBorder, lineWidth: 1))
            }

            CustomFormField(label: "Custom Domain (Optional)", placeholder: "www.mybusiness.com", text: $customDomain)
        }
    }

    // MARK: - Step 6: Launch Review
    private var step6LaunchView: some View {
        VStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(Color.manaViolet.opacity(0.12))
                    .frame(width: 80, height: 80)
                Image(systemName: "checkmark.seal.fill")
                    .font(.system(size: 44))
                    .foregroundColor(.manaViolet)
            }

            Text("Ready to Launch!")
                .font(.system(size: 22, weight: .black))
                .foregroundColor(.manaTextPrimary)

            Text("Your business profile '\(businessName.isEmpty ? "My Business" : businessName)' will be live on ManaCity Tirupati aggregator directory instantly.")
                .font(.system(size: 14))
                .foregroundColor(.manaTextSecondary)
                .multilineTextAlignment(.center)

            VStack(alignment: .leading, spacing: 10) {
                SummaryRow(label: "Business", value: businessName)
                SummaryRow(label: "Category", value: category)
                SummaryRow(label: "Phone", value: mobileNumber)
                SummaryRow(label: "Location", value: "\(areaLocality), \(city)")
                SummaryRow(label: "Website", value: "\(subdomain.isEmpty ? "mybusiness" : subdomain).manacity.in")
            }
            .padding(14)
            .background(Color.manaSurfaceDark)
            .cornerRadius(12)
            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.manaBorder, lineWidth: 1))
        }
        .padding(.vertical, 10)
    }

    private func validateStep() -> Bool {
        errorMessage = nil
        if currentStep == 1 && businessName.trimmingCharacters(in: .whitespaces).isEmpty {
            errorMessage = "Please enter your Business Name."
            return false
        }
        if currentStep == 2 && mobileNumber.trimmingCharacters(in: .whitespaces).isEmpty {
            errorMessage = "Please enter your Mobile Number."
            return false
        }
        return true
    }

    private func submitOnboarding() {
        isSubmitting = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
            isSubmitting = false
            UserDefaults.standard.set(businessName, forKey: "userBusinessName")
            onComplete()
        }
    }
}

struct CustomFormField: View {
    let label: String
    let placeholder: String
    @Binding var text: String

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label)
                .font(.system(size: 13, weight: .bold))
                .foregroundColor(.manaTextPrimary)
            TextField(placeholder, text: $text)
                .font(.system(size: 14))
                .foregroundColor(.manaTextPrimary)
                .padding(12)
                .background(Color.manaSurfaceDark)
                .cornerRadius(10)
                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.manaBorder, lineWidth: 1))
        }
    }
}

struct SummaryRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(.manaTextSecondary)
            Spacer()
            Text(value.isEmpty ? "-" : value)
                .font(.system(size: 13, weight: .bold))
                .foregroundColor(.manaTextPrimary)
        }
    }
}
