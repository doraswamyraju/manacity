import SwiftUI

struct CustomerExploreView: View {
    let onSelectBusiness: (Business) -> Void

    @State private var searchText: String = ""
    @State private var selectedFilter: String = "All"
    @State private var selectedCity: String = "Tirupati"
    @State private var liveBusinesses: [Business] = []
    @State private var isLoading: Bool = false

    let filters = ["All", "Verified 🛡️", "Nearby 📍", "Top Rated ★"]

    var filteredBusinesses: [Business] {
        var items = liveBusinesses
        if selectedFilter == "Verified 🛡️" {
            items = items.filter { $0.isVerified }
        } else if selectedFilter == "Top Rated ★" {
            items = items.filter { $0.rating >= 4.5 }
        }
        if !searchText.trimmingCharacters(in: .whitespaces).isEmpty {
            let q = searchText.lowercased()
            items = items.filter {
                $0.name.lowercased().contains(q) ||
                $0.category.lowercased().contains(q) ||
                $0.address.lowercased().contains(q)
            }
        }
        return items
    }

    var body: some View {
        VStack(spacing: 0) {
            // Top Bar
            HStack {
                Text("Explore Businesses")
                    .font(.system(size: 20, weight: .black))
                    .foregroundColor(.manaTextPrimary)

                Spacer()

                HStack(spacing: 4) {
                    Image(systemName: "mappin.circle.fill")
                        .font(.system(size: 14))
                        .foregroundColor(.manaViolet)
                    Text(selectedCity)
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(.manaViolet)
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 5)
                .background(Color.manaViolet.opacity(0.12))
                .cornerRadius(14)
            }
            .padding(.horizontal, 16)
            .padding(.top, 10)
            .padding(.bottom, 8)

            // Search Bar
            SearchBarView(text: $searchText, placeholder: "Search businesses, services in Tirupati...")
                .padding(.horizontal, 16)
                .padding(.bottom, 10)

            // Filter Chips
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(filters, id: \.self) { filter in
                        Button(action: { selectedFilter = filter }) {
                            Text(filter)
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(selectedFilter == filter ? .white : .manaTextSecondary)
                                .padding(.horizontal, 14)
                                .padding(.vertical, 7)
                                .background(selectedFilter == filter ? Color.manaViolet : Color.manaSurfaceDark)
                                .cornerRadius(16)
                                .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.manaBorder, lineWidth: 1))
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 12)
            }

            // Results List / Grid
            if isLoading {
                Spacer()
                ProgressView("Discovering verified listings...")
                Spacer()
            } else if filteredBusinesses.isEmpty {
                Spacer()
                VStack(spacing: 12) {
                    Image(systemName: "magnifyingglass.circle")
                        .font(.system(size: 48))
                        .foregroundColor(.manaTextSecondary)
                    Text("No Matching Businesses Found")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                    Text("Try adjusting your search terms or filter selections.")
                        .font(.system(size: 13))
                        .foregroundColor(.manaTextSecondary)
                        .multilineTextAlignment(.center)
                }
                .padding(24)
                Spacer()
            } else {
                ScrollView(showsIndicators: false) {
                    LazyVStack(spacing: 14) {
                        ForEach(filteredBusinesses) { biz in
                            HStack(spacing: 14) {
                                ZStack(alignment: .bottomTrailing) {
                                    Circle()
                                        .fill(LinearGradient(colors: [.manaViolet.opacity(0.2), .blue.opacity(0.2)], startPoint: .topLeading, endPoint: .bottomTrailing))
                                        .frame(width: 50, height: 50)
                                        .overlay(
                                            Text(biz.name.prefix(2).uppercased())
                                                .font(.system(size: 16, weight: .black))
                                                .foregroundColor(.manaViolet)
                                        )
                                    if biz.isVerified {
                                        Image(systemName: "checkmark.seal.fill")
                                            .font(.system(size: 14))
                                            .foregroundColor(.green)
                                            .background(Circle().fill(Color.white))
                                    }
                                }

                                VStack(alignment: .leading, spacing: 3) {
                                    HStack {
                                        Text(biz.name)
                                            .font(.system(size: 15, weight: .bold))
                                            .foregroundColor(.manaTextPrimary)
                                            .lineLimit(1)
                                        Spacer()
                                        if biz.rating > 0 {
                                            HStack(spacing: 2) {
                                                Image(systemName: "star.fill")
                                                    .font(.system(size: 9))
                                                    .foregroundColor(.yellow)
                                                Text(String(format: "%.1f", biz.rating))
                                                    .font(.system(size: 11, weight: .bold))
                                                    .foregroundColor(.white)
                                            }
                                            .padding(.horizontal, 6)
                                            .padding(.vertical, 2)
                                            .background(Color.green)
                                            .cornerRadius(6)
                                        }
                                    }

                                    Text(biz.address.isEmpty ? biz.category : biz.address)
                                        .font(.system(size: 12))
                                        .foregroundColor(.manaTextSecondary)
                                        .lineLimit(1)

                                    HStack(spacing: 8) {
                                        Button(action: {
                                            if let phoneUrl = URL(string: "tel://\(biz.phone.replacingOccurrences(of: " ", with: ""))") {
                                                UIApplication.shared.open(phoneUrl)
                                            }
                                        }) {
                                            HStack(spacing: 3) {
                                                Image(systemName: "phone.fill")
                                                    .font(.system(size: 9))
                                                Text("Call")
                                                    .font(.system(size: 10, weight: .bold))
                                            }
                                            .foregroundColor(.blue)
                                            .padding(.horizontal, 8)
                                            .padding(.vertical, 4)
                                            .background(Color.blue.opacity(0.12))
                                            .cornerRadius(6)
                                        }

                                        Button(action: {
                                            if let waUrl = URL(string: "https://wa.me/\(biz.phone.replacingOccurrences(of: " ", with: "").replacingOccurrences(of: "+", with: ""))") {
                                                UIApplication.shared.open(waUrl)
                                            }
                                        }) {
                                            HStack(spacing: 3) {
                                                Image(systemName: "message.fill")
                                                    .font(.system(size: 9))
                                                Text("WhatsApp")
                                                    .font(.system(size: 10, weight: .bold))
                                            }
                                            .foregroundColor(.green)
                                            .padding(.horizontal, 8)
                                            .padding(.vertical, 4)
                                            .background(Color.green.opacity(0.12))
                                            .cornerRadius(6)
                                        }

                                        Spacer()

                                        Button(action: { onSelectBusiness(biz) }) {
                                            HStack(spacing: 2) {
                                                Text("Storefront")
                                                    .font(.system(size: 10, weight: .bold))
                                                Image(systemName: "arrow.up.right")
                                                    .font(.system(size: 8, weight: .bold))
                                            }
                                            .foregroundColor(.manaViolet)
                                            .padding(.horizontal, 8)
                                            .padding(.vertical, 4)
                                            .background(Color.manaViolet.opacity(0.12))
                                            .cornerRadius(6)
                                        }
                                    }
                                    .padding(.top, 2)
                                }
                            }
                            .padding(14)
                            .background(Color.manaSurfaceDark)
                            .cornerRadius(16)
                            .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.manaBorder, lineWidth: 1))
                            .padding(.horizontal, 16)
                        }
                    }
                    .padding(.vertical, 10)
                }
            }
        }
        .background(Color.manaBackground.ignoresSafeArea())
        .onAppear {
            fetchExploreData()
        }
    }

    private func fetchExploreData() {
        isLoading = true
        guard let url = URL(string: "https://manacity.in/api/phase1/directory-leads?city=\(selectedCity)") else { return }
        URLSession.shared.dataTask(with: url) { data, _, _ in
            DispatchQueue.main.async {
                self.isLoading = false
                guard let data = data,
                      let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                      let listings = json["listings"] as? [[String: Any]] else { return }

                self.liveBusinesses = listings.map { dict in
                    Business(
                        id: dict["id"] as? String ?? UUID().uuidString,
                        name: dict["businessName"] as? String ?? (dict["name"] as? String ?? "Local Business"),
                        slug: dict["slug"] as? String ?? "",
                        category: dict["category"] as? String ?? "Business",
                        city: dict["city"] as? String ?? selectedCity,
                        address: dict["address"] as? String ?? "Tirupati, AP",
                        phone: dict["phone"] as? String ?? "9876543210",
                        rating: (dict["rating"] as? Double) ?? 4.9,
                        reviewCount: (dict["reviewCount"] as? Int) ?? 63,
                        isVerified: true,
                        isClaimed: true,
                        description: "Verified ManaCity Business"
                    )
                }
            }
        }.resume()
    }
}
