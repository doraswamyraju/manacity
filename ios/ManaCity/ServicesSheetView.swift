import SwiftUI

struct ServicesSheetView: View {
    @Binding var searchQuery: String
    @Binding var selectedCategory: String
    let quickCategories: [(name: String, icon: String, color: Color)]
    let selectedCity: String
    let onSelectBusiness: (Business) -> Void
    let onSelectUnonboarded: (Business) -> Void
    let onClose: () -> Void

    @State private var searchSuggestions: [Business] = []
    @State private var isSearching: Bool = false

    var body: some View {
        VStack(spacing: 16) {
            Capsule()
                .fill(Color.gray.opacity(0.4))
                .frame(width: 40, height: 5)
                .padding(.top, 10)

            HStack {
                ManaLogoView(type: .horizontal, height: 28)
                Spacer()
                Text("All Local Services")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.manaTextPrimary)
                Spacer()
                Button(action: onClose) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(.manaTextSecondary)
                }
            }
            .padding(.horizontal, 16)

            // Reusable Active SearchBar with autoFocus = true
            SearchBarView(
                text: $searchQuery,
                placeholder: "Search restaurants, doctors, services...",
                autoFocus: true
            )
            .onChange(of: searchQuery) { newValue in
                performLiveSearch(query: newValue)
            }
            .padding(.horizontal, 16)

            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    // Live Search Autocomplete Overlay Dropdown (Parity with Landing Page Search Bar)
                    if (!searchSuggestions.isEmpty || isSearching) && !searchQuery.trimmingCharacters(in: .whitespaces).isEmpty {
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Text("Search Suggestions")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(.manaTextSecondary)
                                Spacer()
                                if isSearching {
                                    ProgressView().scaleEffect(0.8)
                                }
                            }

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
                                            onClose()
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
                                            onClose()
                                            onSelectUnonboarded(item)
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
                            }
                        }
                    }

                    Text("Browse Categories")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.manaTextPrimary)

                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 14) {
                        ForEach(quickCategories, id: \.name) { cat in
                            Button(action: {
                                selectedCategory = cat.name
                                onClose()
                            }) {
                                VStack(spacing: 8) {
                                    ZStack {
                                        Circle()
                                            .fill(cat.color.opacity(0.12))
                                            .frame(width: 52, height: 52)
                                        Image(systemName: cat.icon)
                                            .font(.system(size: 20))
                                            .foregroundColor(cat.color)
                                    }
                                    Text(cat.name)
                                        .font(.system(size: 11, weight: .semibold))
                                        .foregroundColor(.manaTextPrimary)
                                        .multilineTextAlignment(.center)
                                        .lineLimit(2)
                                }
                            }
                        }
                    }
                }
                .padding(16)
            }
        }
        .background(Color.manaBackground.ignoresSafeArea())
    }

    private func performLiveSearch(query: String) {
        let q = query.trimmingCharacters(in: .whitespaces)
        guard q.count >= 1 else {
            searchSuggestions = []
            return
        }

        isSearching = true
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

                self.searchSuggestions = dbResults

                if let gUrl = URL(string: "https://manacity.in/api/phase1/google-places/autocomplete?input=\(encodedQuery)") {
                    var request = URLRequest(url: gUrl)
                    if let token = UserDefaults.standard.string(forKey: "userToken"), !token.isEmpty {
                        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
                    }

                    URLSession.shared.dataTask(with: request) { gData, _, _ in
                        DispatchQueue.main.async {
                            self.isSearching = false
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

                                let filteredGoogleItems = googleItems.filter { g in
                                    let gNameLower = g.name.lowercased().trimmingCharacters(in: .whitespaces)
                                    return !dbResults.contains(where: { db in
                                        let dbNameLower = db.name.lowercased().trimmingCharacters(in: .whitespaces)
                                        return dbNameLower.contains(gNameLower) || gNameLower.contains(dbNameLower)
                                    })
                                }

                                var combined = dbResults
                                combined.append(contentsOf: filteredGoogleItems)
                                self.searchSuggestions = combined
                            }
                        }
                    }.resume()
                } else {
                    self.isSearching = false
                }
            }
        }.resume()
    }
}
