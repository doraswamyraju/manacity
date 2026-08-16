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
    @State private var isSearching: Bool = false
    @State private var showCityPicker: Bool = false
    @State private var showServicesSheet: Bool = false

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

    var body: some View {
        ZStack(alignment: .bottom) {
            Color.manaBackground.ignoresSafeArea()

            VStack(spacing: 0) {
                // MARK: - Top Navigation Bar (Logo + Sign In Icon ONLY, No topbar location)
                HStack(spacing: 12) {
                    // ManaCity Horizontal Logo
                    ManaLogoView(type: .horizontal, height: 34)

                    Spacer()

                    // Sign In Icon Button in Top Bar (Icon Only)
                    Button(action: onNavigateToLogin) {
                        Image(systemName: "person.crop.circle.badge.plus")
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
                        // Hero Header & Location Selector
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Find everything near you in")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.manaTextSecondary)

                            Button(action: { showCityPicker.toggle() }) {
                                HStack(spacing: 6) {
                                    Text(selectedCity)
                                        .font(.system(size: 24, weight: .black))
                                        .foregroundColor(.manaViolet)
                                    Image(systemName: "chevron.down")
                                        .font(.system(size: 14, weight: .bold))
                                        .foregroundColor(.manaViolet)
                                }
                            }

                            // Unified Search Bar with Auto-complete API
                            SearchBarView(text: $searchText, placeholder: "Search restaurants, doctors, services...")
                                .onChange(of: searchText) { newValue in
                                    performLiveSearch(query: newValue)
                                }
                        }
                        .padding(.horizontal, 16)
                        .padding(.top, 14)

                        // Search Autocomplete Results Dropdown (DB + Google Places)
                        if !searchSuggestions.isEmpty && !searchText.isEmpty {
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Search Suggestions")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(.manaTextSecondary)
                                    .padding(.horizontal, 16)

                                ForEach(searchSuggestions) { item in
                                    Button(action: {
                                        onSelectBusiness(item)
                                    }) {
                                        HStack {
                                            Image(systemName: item.isVerified ? "checkmark.seal.fill" : "mappin.and.ellipse")
                                                .foregroundColor(item.isVerified ? .green : .blue)
                                            VStack(alignment: .leading, spacing: 2) {
                                                Text(item.name)
                                                    .font(.system(size: 13, weight: .bold))
                                                    .foregroundColor(.manaTextPrimary)
                                                Text(item.address)
                                                    .font(.system(size: 11))
                                                    .foregroundColor(.manaTextSecondary)
                                            }
                                            Spacer()
                                            if item.isVerified {
                                                Text("Verified").font(.system(size: 10, weight: .bold)).foregroundColor(.green)
                                            } else {
                                                Text("Google").font(.system(size: 10, weight: .bold)).foregroundColor(.blue)
                                            }
                                        }
                                        .padding(10)
                                        .background(Color.manaSurfaceDark)
                                        .cornerRadius(10)
                                    }
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
                        .padding(.bottom, 80)
                    }
                }
            }

            // MARK: - Dual Split Bottom Navigation Bar
            HStack(spacing: 0) {
                HStack(spacing: 20) {
                    Button(action: {}) {
                        VStack(spacing: 3) {
                            Image(systemName: "house.fill").font(.system(size: 16))
                            Text("Home").font(.system(size: 10, weight: .bold))
                        }
                        .foregroundColor(.manaViolet)
                    }

                    Button(action: {}) {
                        VStack(spacing: 3) {
                            Image(systemName: "box.truck.fill").font(.system(size: 16))
                            Text("Track").font(.system(size: 10, weight: .semibold))
                        }
                        .foregroundColor(.manaTextSecondary)
                    }

                    Button(action: onNavigateToLogin) {
                        VStack(spacing: 3) {
                            Image(systemName: "person.crop.circle").font(.system(size: 16))
                            Text("Profile").font(.system(size: 10, weight: .semibold))
                        }
                        .foregroundColor(.manaTextSecondary)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(Color.manaSurfaceDark)
                .cornerRadius(24)
                .overlay(RoundedRectangle(cornerRadius: 24).stroke(Color.manaBorder, lineWidth: 1))

                Spacer()

                Button(action: { showServicesSheet = true }) {
                    ZStack {
                        Circle()
                            .fill(LinearGradient(colors: [.manaViolet, .manaTeal], startPoint: .topLeading, endPoint: .bottomTrailing))
                            .frame(width: 48, height: 48)
                            .shadow(color: Color.manaViolet.opacity(0.4), radius: 6, y: 3)
                        HStack(spacing: 2) {
                            ManaLogoView(type: .square, height: 18)
                            Image(systemName: "magnifyingglass")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white)
                        }
                    }
                }
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
                onClose: { showServicesSheet = false }
            )
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
        guard query.trimmingCharacters(in: .whitespaces).count >= 2 else {
            searchSuggestions = []
            return
        }

        let citySlug = selectedCity.lowercased()
        let encodedQuery = query.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? query

        // 1. Fetch live DB search items
        guard let dbUrl = URL(string: "https://manacity.in/api/phase1/directory/\(citySlug)/all?query=\(encodedQuery)") else { return }

        URLSession.shared.dataTask(with: dbUrl) { data, _, _ in
            DispatchQueue.main.async {
                guard let data = data,
                      let res = try? JSONDecoder().decode(DirectoryApiResponse.self, from: data) else { return }

                var results: [Business] = res.listings.prefix(4).map { l in
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

                // 2. Fetch Google Places Autocomplete items
                if let gUrl = URL(string: "https://manacity.in/api/phase1/google-places/autocomplete?input=\(encodedQuery)") {
                    URLSession.shared.dataTask(with: gUrl) { gData, _, _ in
                        DispatchQueue.main.async {
                            if let gData = gData,
                               let gJson = try? JSONSerialization.jsonObject(with: gData) as? [String: Any],
                               let predictions = gJson["predictions"] as? [[String: Any]] {
                                let googleItems: [Business] = predictions.prefix(4).map { p in
                                    Business(
                                        id: p["placeId"] as? String ?? UUID().uuidString,
                                        name: p["name"] as? String ?? (p["description"] as? String ?? "Google Result"),
                                        slug: "",
                                        category: "Google Business Result",
                                        city: selectedCity,
                                        address: p["description"] as? String ?? "",
                                        phone: "",
                                        rating: 4.5,
                                        reviewCount: 0,
                                        isVerified: false,
                                        isClaimed: false,
                                        description: "Google Places Listing"
                                    )
                                }
                                results.append(contentsOf: googleItems)
                            }
                            self.searchSuggestions = results
                        }
                    }.resume()
                } else {
                    self.searchSuggestions = results
                }
            }
        }.resume()
    }
}

struct DirectoryApiResponse: Codable {
    let success: Bool?
    let listings: [DirectoryListingApiItem]
}

struct DirectoryListingApiItem: Codable {
    let id: String?
    let businessName: String
    let category: String
    let city: String
    let slug: String?
    let rating: Double?
    let reviewCount: Int?
    let phone: String
    let address: String
    let logoUrl: String?
    let coverImage: String?
    let verified: Bool?
    let services: [String]?
}
