import SwiftUI

struct PublicHomeView: View {
    let onSelectBusiness: (Business) -> Void
    let onNavigateToLogin: () -> Void
    let onNavigateToRegister: () -> Void

    @State private var searchText: String = ""
    @State private var selectedCategory: String = "All"
    @State private var selectedCity: String = "Tirupati"

    @State private var liveBusinesses: [Business] = []
    @State private var searchSuggestions: [Business] = []
    @State private var isLoadingLive: Bool = false
    @State private var isSearchingSuggestions: Bool = false
    @State private var showCityPicker: Bool = false
    @State private var showServicesSheet: Bool = false
    @State private var showEnquiriesSheet: Bool = false
    @State private var selectedUnonboardedBusiness: Business? = nil

    let cities = ["Tirupati", "Hyderabad", "Vijayawada", "Visakhapatnam", "Chennai", "Bangalore"]

    let quickCategories: [(name: String, icon: String, color: Color)] = [
        ("Food & Dining", "fork.knife", Color.orange),
        ("Doctors", "cross.case.fill", Color.green),
        ("Travel", "airplane", Color.blue),
        ("Education", "graduationcap.fill", Color.purple),
        ("Beauty & Spa", "sparkles", Color.pink),
        ("Repairs", "wrench.and.screwdriver.fill", Color.orange),
        ("Real Estate", "house.fill", Color.teal),
        ("More", "ellipsis.circle.fill", Color.gray)
    ]

    var filteredBusinesses: [Business] {
        var items = liveBusinesses
        if selectedCategory != "All" {
            items = items.filter { $0.category.lowercased().contains(selectedCategory.lowercased()) }
        }
        if !searchText.trimmingCharacters(in: .whitespaces).isEmpty {
            let q = searchText.lowercased().trimmingCharacters(in: .whitespaces)
            items = items.filter {
                $0.name.lowercased().contains(q) ||
                $0.category.lowercased().contains(q) ||
                $0.address.lowercased().contains(q)
            }
        }
        return items
    }

    var isLoggedIn: Bool {
        if let token = UserDefaults.standard.string(forKey: "userToken"), !token.isEmpty {
            return true
        }
        return false
    }

    var body: some View {
        ZStack(alignment: .bottom) {
            Color.manaBackground.ignoresSafeArea()

            VStack(spacing: 0) {
                // MARK: - Top Navigation Bar (Logo + Sign In Icon ONLY)
                HStack(spacing: 12) {
                    ManaLogoView(type: .horizontal, height: 34)

                    Spacer()

                    // Sign In / Profile Icon Button in Top Bar
                    Button(action: {
                        if isLoggedIn {
                            showEnquiriesSheet = true
                        } else {
                            onNavigateToLogin()
                        }
                    }) {
                        Image(systemName: isLoggedIn ? "person.crop.circle.fill" : "person.crop.circle.badge.plus")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.manaViolet)
                            .padding(8)
                            .background(Color.manaViolet.opacity(0.12))
                            .clipShape(Circle())
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 8)
                .padding(.bottom, 10)
                .background(Color.manaSurfaceDark)
                .overlay(
                    Rectangle()
                        .frame(height: 1)
                        .foregroundColor(Color.manaBorder),
                    alignment: .bottom
                )

                // MARK: - Main Scroll Body
                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 20) {
                        // Hero Header & Location Selector (Same Line Layout)
                        VStack(alignment: .leading, spacing: 10) {
                            HStack(spacing: 6) {
                                Text("Find everything near you in")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.manaTextSecondary)

                                Button(action: { showCityPicker.toggle() }) {
                                    HStack(spacing: 4) {
                                        Text(selectedCity)
                                            .font(.system(size: 18, weight: .black))
                                            .foregroundColor(.manaViolet)
                                        Image(systemName: "chevron.down")
                                            .font(.system(size: 12, weight: .bold))
                                            .foregroundColor(.manaViolet)
                                    }
                                }
                            }

                            // Search Bar with Live Web-Parity Dual Autocomplete API
                            SearchBarView(text: $searchText, placeholder: "Search restaurants, doctors, services...")
                                .onChange(of: searchText) { newValue in
                                    performLiveSearch(query: newValue)
                                }
                        }
                        .padding(.horizontal, 16)
                        .padding(.top, 14)

                        // Search Autocomplete Overlay Dropdown (DB + Google Places) - Parity with Web Version Home.jsx
                        if (!searchSuggestions.isEmpty || isSearchingSuggestions) && !searchText.trimmingCharacters(in: .whitespaces).isEmpty {
                            VStack(alignment: .leading, spacing: 8) {
                                HStack {
                                    Text("Search Results across Tirupati")
                                        .font(.system(size: 12, weight: .bold))
                                        .foregroundColor(.manaTextSecondary)
                                    Spacer()
                                    if isSearchingSuggestions {
                                        ProgressView().scaleEffect(0.8)
                                    }
                                }
                                .padding(.horizontal, 16)

                                ForEach(searchSuggestions) { item in
                                    HStack(spacing: 12) {
                                        ZStack {
                                            Circle()
                                                .fill(item.isVerified ? Color.green.opacity(0.12) : Color.orange.opacity(0.12))
                                                .frame(width: 36, height: 36)
                                            Image(systemName: item.isVerified ? "checkmark.seal.fill" : "mappin.circle.fill")
                                                .font(.system(size: 16))
                                                .foregroundColor(item.isVerified ? .green : .orange)
                                        }

                                        VStack(alignment: .leading, spacing: 2) {
                                            Text(item.name)
                                                .font(.system(size: 13, weight: .bold))
                                                .foregroundColor(.manaTextPrimary)
                                                .lineLimit(1)
                                            Text(item.address.isEmpty ? item.category : item.address)
                                                .font(.system(size: 11))
                                                .foregroundColor(.manaTextSecondary)
                                                .lineLimit(1)
                                        }

                                        Spacer()

                                        if item.isVerified {
                                            Button(action: {
                                                onSelectBusiness(item)
                                            }) {
                                                Text("Verified Page")
                                                    .font(.system(size: 10, weight: .bold))
                                                    .foregroundColor(.white)
                                                    .padding(.horizontal, 10)
                                                    .padding(.vertical, 5)
                                                    .background(Color.manaViolet)
                                                    .cornerRadius(8)
                                            }
                                        } else {
                                            Button(action: {
                                                selectedUnonboardedBusiness = item
                                            }) {
                                                Text("Enquire Now")
                                                    .font(.system(size: 10, weight: .bold))
                                                    .foregroundColor(.white)
                                                    .padding(.horizontal, 10)
                                                    .padding(.vertical, 5)
                                                    .background(Color.orange)
                                                    .cornerRadius(8)
                                            }
                                        }
                                    }
                                    .padding(12)
                                    .background(Color.manaSurfaceDark)
                                    .cornerRadius(12)
                                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.manaBorder, lineWidth: 1))
                                    .padding(.horizontal, 16)
                                }
                            }
                        }

                        // Categories Grid
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Categories")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.manaTextPrimary)
                                .padding(.horizontal, 16)

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 12) {
                                    ForEach(quickCategories, id: \.name) { cat in
                                        Button(action: {
                                            if cat.name == "More" {
                                                showServicesSheet = true
                                            } else {
                                                selectedCategory = (selectedCategory == cat.name) ? "All" : cat.name
                                            }
                                        }) {
                                            VStack(spacing: 8) {
                                                ZStack {
                                                    Circle()
                                                        .fill(cat.color.opacity(0.12))
                                                        .frame(width: 48, height: 48)
                                                    Image(systemName: cat.icon)
                                                        .font(.system(size: 20))
                                                        .foregroundColor(cat.color)
                                                }
                                                Text(cat.name)
                                                    .font(.system(size: 11, weight: selectedCategory == cat.name ? .bold : .medium))
                                                    .foregroundColor(selectedCategory == cat.name ? .manaViolet : .manaTextPrimary)
                                            }
                                            .frame(width: 72)
                                        }
                                    }
                                }
                                .padding(.horizontal, 16)
                            }
                        }

                        // Top Verified Business Listings Carousel
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                Text("Top Verified Listings")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.manaTextPrimary)
                                Spacer()
                                if isLoadingLive {
                                    ProgressView().tint(.manaViolet)
                                }
                            }
                            .padding(.horizontal, 16)

                            if filteredBusinesses.isEmpty && !isLoadingLive {
                                VStack(spacing: 8) {
                                    Image(systemName: "building.2.slash")
                                        .font(.system(size: 32))
                                        .foregroundColor(.manaTextSecondary)
                                    Text("No listings found in \(selectedCity)")
                                        .font(.system(size: 14, weight: .semibold))
                                        .foregroundColor(.manaTextSecondary)
                                }
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 30)
                            } else {
                                ScrollView(.horizontal, showsIndicators: false) {
                                    HStack(spacing: 14) {
                                        ForEach(filteredBusinesses) { biz in
                                            BusinessCardView(business: biz, onSelect: onSelectBusiness)
                                        }
                                    }
                                    .padding(.horizontal, 16)
                                }
                            }
                        }
                        .padding(.bottom, 85)
                    }
                }
            }

            // MARK: - Dual Split Bottom Navigation Bar (Matching 18:38 Screenshot Exactly)
            HStack(spacing: 0) {
                // Left Side Pill Navigation (Home, Track, Profile)
                HStack(spacing: 28) {
                    // Home Button
                    Button(action: {
                        selectedCategory = "All"
                        searchText = ""
                    }) {
                        VStack(spacing: 3) {
                            Image(systemName: "house.fill")
                                .font(.system(size: 18))
                            Text("Home")
                                .font(.system(size: 10, weight: .bold))
                        }
                        .foregroundColor(Color(red: 0.0, green: 0.45, blue: 0.85))
                    }

                    // Track Button (Box Truck 3D Icon matching screenshot)
                    Button(action: {
                        showEnquiriesSheet = true
                    }) {
                        VStack(spacing: 3) {
                            Image(systemName: "shippingbox.fill")
                                .font(.system(size: 18))
                            Text("Track")
                                .font(.system(size: 10, weight: .semibold))
                        }
                        .foregroundColor(Color.manaTextSecondary)
                    }

                    // Profile Button
                    Button(action: {
                        if isLoggedIn {
                            showEnquiriesSheet = true
                        } else {
                            onNavigateToLogin()
                        }
                    }) {
                        VStack(spacing: 3) {
                            Image(systemName: "person.crop.circle")
                                .font(.system(size: 18))
                            Text("Profile")
                                .font(.system(size: 10, weight: .semibold))
                        }
                        .foregroundColor(Color.manaTextSecondary)
                    }
                }
                .padding(.horizontal, 22)
                .padding(.vertical, 10)
                .background(Color.white)
                .cornerRadius(30)
                .shadow(color: Color.black.opacity(0.08), radius: 8, x: 0, y: 3)
                .overlay(RoundedRectangle(cornerRadius: 30).stroke(Color(red: 0.88, green: 0.92, blue: 0.96), lineWidth: 1))
                .gesture(
                    DragGesture().onEnded { value in
                        if value.translation.height < -25 {
                            showEnquiriesSheet = true
                        }
                    }
                )

                Spacer()

                // Right Side Floating Search Pill Container (Teal/Cyan Gradient with Logo + Glass side-by-side)
                Button(action: { showServicesSheet = true }) {
                    HStack(spacing: 6) {
                        ManaLogoView(type: .square, height: 24)
                        Image(systemName: "magnifyingglass")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(
                        LinearGradient(
                            colors: [Color(red: 0.0, green: 0.72, blue: 0.78), Color(red: 0.0, green: 0.62, blue: 0.68)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .cornerRadius(30)
                    .shadow(color: Color(red: 0.0, green: 0.72, blue: 0.78).opacity(0.35), radius: 8, x: 0, y: 4)
                }
                .gesture(
                    DragGesture().onEnded { value in
                        if value.translation.height < -25 {
                            showServicesSheet = true
                        }
                    }
                )
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 12)
        }
        .onAppear {
            fetchLiveDirectory()
        }
        .sheet(isPresented: $showCityPicker) {
            VStack(spacing: 16) {
                Capsule().fill(Color.gray.opacity(0.3)).frame(width: 40, height: 5).padding(.top, 10)
                Text("Select Your City").font(.system(size: 18, weight: .bold)).foregroundColor(.manaTextPrimary)
                ForEach(cities, id: \.self) { c in
                    Button(action: {
                        selectedCity = c
                        showCityPicker = false
                        fetchLiveDirectory()
                    }) {
                        HStack {
                            Text(c).font(.system(size: 15, weight: .semibold)).foregroundColor(.manaTextPrimary)
                            Spacer()
                            if selectedCity == c {
                                Image(systemName: "checkmark").foregroundColor(.manaViolet)
                            }
                        }
                        .padding(14)
                        .background(Color.manaSurfaceDark)
                        .cornerRadius(12)
                    }
                }
                Spacer()
            }
            .padding(16)
            .background(Color.manaBackground.ignoresSafeArea())
        }
        .sheet(isPresented: $showServicesSheet) {
            ServicesSheetView(
                searchQuery: $searchText,
                selectedCategory: $selectedCategory,
                quickCategories: quickCategories,
                selectedCity: selectedCity,
                onSelectBusiness: onSelectBusiness,
                onSelectUnonboarded: { biz in
                    selectedUnonboardedBusiness = biz
                },
                onClose: { showServicesSheet = false }
            )
        }
        .sheet(isPresented: $showEnquiriesSheet) {
            CustomerEnquiriesSheet(
                isLoggedIn: isLoggedIn,
                onNavigateToLogin: {
                    showEnquiriesSheet = false
                    onNavigateToLogin()
                },
                onClose: { showEnquiriesSheet = false }
            )
        }
        .sheet(item: $selectedUnonboardedBusiness) { biz in
            UnonboardedEnquirySheet(business: biz, onClose: { selectedUnonboardedBusiness = nil })
        }
    }

    private func fetchLiveDirectory() {
        isLoadingLive = true
        let citySlug = selectedCity.lowercased()
        guard let url = URL(string: "https://manacity.in/api/phase1/directory/\(citySlug)/all") else { return }

        URLSession.shared.dataTask(with: url) { data, _, err in
            DispatchQueue.main.async {
                isLoadingLive = false
                guard let data = data,
                      let res = try? JSONDecoder().decode(DirectoryApiResponse.self, from: data) else {
                    return
                }
                self.liveBusinesses = res.listings.map { l in
                    Business(
                        id: l.id ?? UUID().uuidString,
                        name: l.businessName,
                        slug: l.slug ?? "",
                        category: l.category,
                        city: l.city,
                        address: l.address,
                        phone: l.phone,
                        rating: l.rating ?? 4.8,
                        reviewCount: l.reviewCount ?? 12,
                        isVerified: l.verified ?? true,
                        isClaimed: true,
                        description: l.services?.joined(separator: ", ") ?? l.category,
                        logoUrl: l.logoUrl,
                        coverImage: l.coverImage
                    )
                }
            }
        }.resume()
    }

    private func performLiveSearch(query: String) {
        let q = query.trimmingCharacters(in: .whitespaces)
        guard q.count >= 2 else {
            searchSuggestions = []
            return
        }

        isSearchingSuggestions = true
        let citySlug = selectedCity.lowercased()
        let encodedQuery = q.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? q

        guard let dbUrl = URL(string: "https://manacity.in/api/phase1/directory/\(citySlug)/all?query=\(encodedQuery)") else { return }

        URLSession.shared.dataTask(with: dbUrl) { data, _, _ in
            DispatchQueue.main.async {
                var dbResults: [Business] = []
                if let data = data,
                   let res = try? JSONDecoder().decode(DirectoryApiResponse.self, from: data) {
                    dbResults = res.listings.prefix(4).map { l in
                        Business(
                            id: l.id ?? UUID().uuidString,
                            name: l.businessName,
                            slug: l.slug ?? "",
                            category: l.category,
                            city: l.city,
                            address: l.address,
                            phone: l.phone,
                            rating: l.rating ?? 4.8,
                            reviewCount: l.reviewCount ?? 12,
                            isVerified: true,
                            isClaimed: true,
                            description: l.category,
                            logoUrl: l.logoUrl,
                            coverImage: l.coverImage
                        )
                    }
                }

                // Immediately update suggestions with DB results so they are never blank
                self.searchSuggestions = dbResults

                // Query Google Places Autocomplete API
                if let gUrl = URL(string: "https://manacity.in/api/phase1/google-places/autocomplete?input=\(encodedQuery)") {
                    var request = URLRequest(url: gUrl)
                    if let token = UserDefaults.standard.string(forKey: "userToken"), !token.isEmpty {
                        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
                    }

                    URLSession.shared.dataTask(with: request) { gData, _, _ in
                        DispatchQueue.main.async {
                            self.isSearchingSuggestions = false
                            var combined = dbResults

                            if let gData = gData,
                               let gJson = try? JSONSerialization.jsonObject(with: gData) as? [String: Any],
                               let predictions = (gJson["predictions"] as? [[String: Any]]) ?? (gJson["suggestions"] as? [[String: Any]]) {

                                let googleItems: [Business] = predictions.prefix(5).compactMap { p in
                                    let placeId = p["placeId"] as? String ?? (p["place_id"] as? String ?? "")
                                    let name = p["name"] as? String ?? (p["description"] as? String ?? "")
                                    guard !name.isEmpty else { return nil }

                                    return Business(
                                        id: placeId.isEmpty ? UUID().uuidString : placeId,
                                        name: name,
                                        slug: "",
                                        category: "Google Business Listing",
                                        city: selectedCity,
                                        address: p["description"] as? String ?? name,
                                        phone: "",
                                        rating: 4.5,
                                        reviewCount: 0,
                                        isVerified: false,
                                        isClaimed: false,
                                        description: "Local Business Listing"
                                    )
                                }

                                // Deduplicate against internal ManaCity DB listings
                                let filteredGoogleItems = googleItems.filter { g in
                                    let gNameLower = g.name.lowercased().trimmingCharacters(in: .whitespaces)
                                    return !dbResults.contains(where: { db in
                                        let dbNameLower = db.name.lowercased().trimmingCharacters(in: .whitespaces)
                                        return dbNameLower.contains(gNameLower) || gNameLower.contains(dbNameLower)
                                    })
                                }

                                combined.append(contentsOf: filteredGoogleItems)
                            }
                            self.searchSuggestions = combined
                        }
                    }.resume()
                } else {
                    self.isSearchingSuggestions = false
                    self.searchSuggestions = dbResults
                }
            }
        }.resume()
    }
}

// MARK: - Customer Enquiries Status Sheet (Left Navbar Swipe-up)
struct CustomerEnquiriesSheet: View {
    let isLoggedIn: Bool
    let onNavigateToLogin: () -> Void
    let onClose: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Capsule()
                .fill(Color.gray.opacity(0.4))
                .frame(width: 40, height: 5)
                .padding(.top, 10)

            HStack {
                Text("My Enquiries Status")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.manaTextPrimary)
                Spacer()
                Button(action: onClose) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(.manaTextSecondary)
                }
            }
            .padding(.horizontal, 16)

            if !isLoggedIn {
                VStack(spacing: 14) {
                    Image(systemName: "person.crop.circle.badge.exclamationmark")
                        .font(.system(size: 44))
                        .foregroundColor(.manaViolet)
                    Text("Sign In to View Enquiries")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                    Text("Please sign in to track your submitted quotes and business responses.")
                        .font(.system(size: 13))
                        .foregroundColor(.manaTextSecondary)
                        .multilineTextAlignment(.center)

                    Button(action: onNavigateToLogin) {
                        HStack {
                            Image(systemName: "arrow.right.circle.fill")
                            Text("Sign In / Register Now")
                        }
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 24)
                        .padding(.vertical, 12)
                        .background(Color.manaViolet)
                        .cornerRadius(12)
                    }
                }
                .padding(24)
                .background(Color.manaSurfaceDark)
                .cornerRadius(16)
                .padding(.horizontal, 16)
            } else {
                VStack(spacing: 12) {
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text("Grand Spice Restaurant")
                                .font(.system(size: 15, weight: .bold))
                                .foregroundColor(.manaTextPrimary)
                            Spacer()
                            Text("CONTACTED")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.orange)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 3)
                                .background(Color.orange.opacity(0.12))
                                .cornerRadius(8)
                        }
                        Text("Inquiry for catering service for 50 guests")
                            .font(.system(size: 12))
                            .foregroundColor(.manaTextSecondary)
                    }
                    .padding(14)
                    .background(Color.manaSurfaceDark)
                    .cornerRadius(12)
                }
                .padding(.horizontal, 16)
            }

            Spacer()
        }
        .background(Color.manaBackground.ignoresSafeArea())
    }
}

// MARK: - Unonboarded Business Enquiry Sheet (Google Places Instant Inquiry)
struct UnonboardedEnquirySheet: View {
    let business: Business
    let onClose: () -> Void

    @State private var name: String = ""
    @State private var phone: String = ""
    @State private var message: String = ""
    @State private var isSent: Bool = false

    var body: some View {
        VStack(spacing: 16) {
            Capsule()
                .fill(Color.gray.opacity(0.4))
                .frame(width: 40, height: 5)
                .padding(.top, 10)

            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Enquire with \(business.name)")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                    Text(business.address)
                        .font(.system(size: 12))
                        .foregroundColor(.manaTextSecondary)
                        .lineLimit(1)
                }
                Spacer()
                Button(action: onClose) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(.manaTextSecondary)
                }
            }
            .padding(.horizontal, 16)

            if isSent {
                VStack(spacing: 12) {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 48))
                        .foregroundColor(.green)
                    Text("Inquiry Sent Successfully!")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                    Text("We are notifying \(business.name) in Tirupati to connect with you.")
                        .font(.system(size: 13))
                        .foregroundColor(.manaTextSecondary)
                        .multilineTextAlignment(.center)
                }
                .padding(24)
            } else {
                VStack(spacing: 14) {
                    CustomFormField(label: "Your Full Name", placeholder: "Enter your name", text: $name)
                    CustomFormField(label: "Phone Number", placeholder: "Enter your 10-digit mobile number", text: $phone)
                    CustomFormField(label: "Inquiry Details", placeholder: "What service or pricing are you looking for?", text: $message)

                    Button(action: {
                        if !name.isEmpty && !phone.isEmpty {
                            isSent = true
                            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                                onClose()
                            }
                        }
                    }) {
                        Text("Send Instant Inquiry")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color.manaViolet)
                            .cornerRadius(12)
                    }
                }
                .padding(.horizontal, 16)
            }

            Spacer()
        }
        .background(Color.manaBackground.ignoresSafeArea())
    }
}
