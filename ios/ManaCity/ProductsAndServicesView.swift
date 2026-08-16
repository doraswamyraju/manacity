import SwiftUI

struct LibraryCatalogItem: Identifiable, Codable {
    let id: String
    let name: String
    let category: String
    let type: String // "SERVICE" or "PRODUCT"
    let defaultPrice: Double?
    let description: String?
    let isAdded: Bool?
}

struct ProductsAndServicesView: View {
    @State private var masterItems: [LibraryCatalogItem] = []
    @State private var myItems: [LibraryCatalogItem] = []
    @State private var isLoading: Bool = false
    @State private var selectedType: String = "All" // "All", "SERVICE", "PRODUCT"
    @State private var selectedCategory: String = "All"
    @State private var searchQuery: String = ""
    @State private var showRequestModal: Bool = false
    @State private var selectedDetailItem: LibraryCatalogItem? = nil

    // Request Form State
    @State private var reqName: String = ""
    @State private var reqCategory: String = "Digital Marketing"
    @State private var reqType: String = "SERVICE"
    @State private var reqPrice: String = ""
    @State private var reqDescription: String = ""
    @State private var reqSuccess: Bool = false

    let categories = ["All", "Digital Marketing", "Clinics & Health", "Services", "Food & Dining", "Real Estate"]

    var filteredItems: [LibraryCatalogItem] {
        var items = masterItems
        if selectedType != "All" {
            items = items.filter { $0.type.uppercased() == selectedType.uppercased() }
        }
        if selectedCategory != "All" {
            items = items.filter { $0.category.lowercased().contains(selectedCategory.lowercased()) }
        }
        if !searchQuery.trimmingCharacters(in: .whitespaces).isEmpty {
            let q = searchQuery.lowercased()
            items = items.filter { $0.name.lowercased().contains(q) || ($0.description?.lowercased().contains(q) ?? false) }
        }
        return items
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // MARK: - Header Banner
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("SUPER ADMIN MASTER LIBRARY SELECTION")
                            .font(.system(size: 10, weight: .black))
                            .foregroundColor(.manaAmber)
                            .tracking(0.5)
                        Text("Products & Services Catalog")
                            .font(.system(size: 20, weight: .black))
                            .foregroundColor(.manaTextPrimary)
                    }
                    Spacer()
                    Image(systemName: "square.grid.3x3.fill")
                        .font(.system(size: 28))
                        .foregroundColor(.manaViolet)
                }

                Text("Select verified offerings from the Central Master Library to display on your custom storefront & ManaCity directory.")
                    .font(.system(size: 12))
                    .foregroundColor(.manaTextSecondary)

                HStack(spacing: 10) {
                    Button(action: { showRequestModal = true }) {
                        HStack(spacing: 4) {
                            Image(systemName: "text.bubble.fill")
                            Text("Request Product/Service")
                        }
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(Color.manaViolet)
                        .cornerRadius(10)
                    }

                    HStack(spacing: 4) {
                        Image(systemName: "sparkles")
                        Text("Explore Library (\(masterItems.count))")
                    }
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(.manaViolet)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(Color.manaViolet.opacity(0.12))
                    .cornerRadius(10)
                }
            }
            .padding(16)
            .background(Color.manaSurfaceDark)
            .cornerRadius(16)
            .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.manaBorder, lineWidth: 1))

            // MARK: - Summary Metrics Row
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text("Available Master Items")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.manaTextSecondary)
                        Spacer()
                        Image(systemName: "layers.fill")
                            .foregroundColor(.manaViolet)
                    }
                    Text("\(masterItems.count)")
                        .font(.system(size: 22, weight: .black))
                        .foregroundColor(.manaTextPrimary)
                    Text("Super Admin Verified")
                        .font(.system(size: 10, weight: .semibold))
                        .foregroundColor(.manaViolet)
                }
                .padding(14)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color.manaSurfaceDark)
                .cornerRadius(14)
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.manaBorder, lineWidth: 1))

                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text("Added to My Business")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.manaTextSecondary)
                        Spacer()
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(.green)
                    }
                    Text("\(myItems.count)")
                        .font(.system(size: 22, weight: .black))
                        .foregroundColor(.manaTextPrimary)
                    Text("Live on Storefront & Directory")
                        .font(.system(size: 10, weight: .semibold))
                        .foregroundColor(.green)
                }
                .padding(14)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color.manaSurfaceDark)
                .cornerRadius(14)
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.manaBorder, lineWidth: 1))
            }

            // MARK: - Filters & Search Bar
            VStack(spacing: 10) {
                // Search Input
                SearchBarView(text: $searchQuery, placeholder: "Search master library...")

                // Type Filter Pills & Category Picker
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(["All", "SERVICE", "PRODUCT"], id: \.self) { t in
                            Button(action: { selectedType = t }) {
                                Text(t == "All" ? "All Types" : (t == "SERVICE" ? "Services Only" : "Products Only"))
                                    .font(.system(size: 11, weight: selectedType == t ? .bold : .medium))
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(selectedType == t ? Color.manaViolet : Color.manaSurfaceDark)
                                    .foregroundColor(selectedType == t ? .white : .manaTextSecondary)
                                    .cornerRadius(16)
                                    .overlay(RoundedRectangle(cornerRadius: 16).stroke(selectedType == t ? Color.manaViolet : Color.manaBorder, lineWidth: 1))
                            }
                        }

                        // Category Menu Picker
                        Menu {
                            ForEach(categories, id: \.self) { cat in
                                Button(cat) { selectedCategory = cat }
                            }
                        } label: {
                            HStack(spacing: 4) {
                                Text(selectedCategory == "All" ? "All Categories" : selectedCategory)
                                    .font(.system(size: 11, weight: .semibold))
                                Image(systemName: "chevron.down")
                                    .font(.system(size: 10))
                            }
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color.manaSurfaceDark)
                            .foregroundColor(.manaViolet)
                            .cornerRadius(16)
                            .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.manaBorder, lineWidth: 1))
                        }
                    }
                }
            }

            // MARK: - Catalog Items List Grid
            if isLoading {
                ProgressView("Loading Master Catalog...")
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 30)
            } else if filteredItems.isEmpty {
                VStack(spacing: 8) {
                    Image(systemName: "square.grid.3x3.fill")
                        .font(.system(size: 36))
                        .foregroundColor(.manaTextSecondary)
                    Text("No catalog offerings available")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.manaTextSecondary)
                    Text("Tap 'Request Product/Service' to add custom offerings.")
                        .font(.system(size: 12))
                        .foregroundColor(.manaTextSecondary)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 30)
            } else {
                VStack(spacing: 12) {
                    ForEach(filteredItems) { item in
                        CatalogItemCard(
                            item: item,
                            isAddedToBusiness: myItems.contains(where: { $0.id == item.id }),
                            onToggleAdd: { toggleItem(item) },
                            onViewDetail: { selectedDetailItem = item }
                        )
                    }
                }
            }
        }
        .onAppear {
            fetchMasterLibrary()
        }
        .sheet(isPresented: $showRequestModal) {
            RequestCatalogItemSheet(
                name: $reqName,
                category: $reqCategory,
                type: $reqType,
                price: $reqPrice,
                description: $reqDescription,
                isSuccess: $reqSuccess,
                onSubmit: submitCatalogRequest,
                onClose: { showRequestModal = false }
            )
        }
        .sheet(item: $selectedDetailItem) { item in
            CatalogDetailSheet(item: item, onClose: { selectedDetailItem = nil })
        }
    }

    private func fetchMasterLibrary() {
        isLoading = true
        guard let url = URL(string: "https://manacity.in/api/phase1/library") else { return }

        URLSession.shared.dataTask(with: url) { data, _, _ in
            DispatchQueue.main.async {
                isLoading = false
                if let data = data,
                   let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                   let itemsRaw = json["items"] as? [[String: Any]] {

                    let parsed: [LibraryCatalogItem] = itemsRaw.map { raw in
                        LibraryCatalogItem(
                            id: raw["id"] as? String ?? UUID().uuidString,
                            name: raw["name"] as? String ?? "Offering Item",
                            category: raw["category"] as? String ?? "General",
                            type: raw["type"] as? String ?? "SERVICE",
                            defaultPrice: raw["defaultPrice"] as? Double,
                            description: raw["description"] as? String ?? "Verified Super Admin catalog offering.",
                            isAdded: false
                        )
                    }
                    self.masterItems = parsed

                    // Populate initial fallback if empty for demonstration
                    if parsed.isEmpty {
                        self.masterItems = [
                            LibraryCatalogItem(id: "101", name: "Social Media", category: "Digital Marketing", type: "SERVICE", defaultPrice: 6999.0, description: "Verified Super Admin catalog offering.", isAdded: true),
                            LibraryCatalogItem(id: "102", name: "Digital Marketing", category: "Digital Marketing", type: "SERVICE", defaultPrice: 7999.0, description: "Verified Super Admin catalog offering.", isAdded: true)
                        ]
                        self.myItems = self.masterItems
                    }
                }
            }
        }.resume()
    }

    private func toggleItem(_ item: LibraryCatalogItem) {
        if let idx = myItems.firstIndex(where: { $0.id == item.id }) {
            myItems.remove(at: idx)
        } else {
            myItems.append(item)
        }
    }

    private func submitCatalogRequest() {
        reqSuccess = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            reqSuccess = false
            showRequestModal = false
            reqName = ""
            reqPrice = ""
            reqDescription = ""
        }
    }
}

// MARK: - Catalog Item Card View (Matching Web Dashboard UI)
struct CatalogItemCard: View {
    let item: LibraryCatalogItem
    let isAddedToBusiness: Bool
    let onToggleAdd: () -> Void
    let onViewDetail: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("\(item.type.uppercased()) • \(item.category.uppercased())")
                    .font(.system(size: 9, weight: .black))
                    .foregroundColor(.manaViolet)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.manaViolet.opacity(0.12))
                    .cornerRadius(6)

                Spacer()

                if let price = item.defaultPrice {
                    Text("₹\(Int(price))")
                        .font(.system(size: 16, weight: .black))
                        .foregroundColor(.manaEmerald)
                } else {
                    Text("Custom Quote")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.manaTextSecondary)
                }
            }

            VStack(alignment: .leading, spacing: 3) {
                Text(item.name)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.manaTextPrimary)
                Text(item.description ?? "Verified Super Admin catalog offering.")
                    .font(.system(size: 12))
                    .foregroundColor(.manaTextSecondary)
                    .lineLimit(2)
            }

            HStack {
                if isAddedToBusiness {
                    HStack(spacing: 4) {
                        Image(systemName: "checkmark")
                        Text("Added to My Business Profile")
                    }
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.green)
                } else {
                    Text("Available in Master Library")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(.manaTextSecondary)
                }

                Spacer()
            }

            Divider().background(Color.manaBorder)

            HStack(spacing: 8) {
                Button(action: onViewDetail) {
                    HStack(spacing: 4) {
                        Image(systemName: "eye")
                        Text("View")
                    }
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.manaTextPrimary)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Color.manaSurfaceDark)
                    .cornerRadius(8)
                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.manaBorder, lineWidth: 1))
                }

                Button(action: onViewDetail) {
                    HStack(spacing: 4) {
                        Image(systemName: "gearshape")
                        Text("Customize")
                    }
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.manaViolet)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Color.manaViolet.opacity(0.12))
                    .cornerRadius(8)
                }

                Spacer()

                Button(action: onToggleAdd) {
                    HStack(spacing: 4) {
                        Image(systemName: isAddedToBusiness ? "trash" : "plus.circle.fill")
                        Text(isAddedToBusiness ? "Remove" : "+ Add Item")
                    }
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(isAddedToBusiness ? .red : .white)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(isAddedToBusiness ? Color.red.opacity(0.12) : Color.manaViolet)
                    .cornerRadius(8)
                }
            }
        }
        .padding(14)
        .background(Color.manaSurfaceDark)
        .cornerRadius(14)
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(isAddedToBusiness ? Color.green.opacity(0.5) : Color.manaBorder, lineWidth: isAddedToBusiness ? 1.5 : 1)
        )
    }
}

// MARK: - Request Catalog Item Sheet
struct RequestCatalogItemSheet: View {
    @Binding var name: String
    @Binding var category: String
    @Binding var type: String
    @Binding var price: String
    @Binding var description: String
    @Binding var isSuccess: Bool

    let onSubmit: () -> Void
    let onClose: () -> Void

    let categories = ["Digital Marketing", "Clinics & Health", "Services", "Food & Dining", "Real Estate"]

    var body: some View {
        VStack(spacing: 16) {
            Capsule().fill(Color.gray.opacity(0.4)).frame(width: 40, height: 5).padding(.top, 10)

            HStack {
                Text("Request Product or Service")
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

            if isSuccess {
                VStack(spacing: 12) {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 48))
                        .foregroundColor(.green)
                    Text("Catalog Request Submitted!")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                    Text("Super Admin will review and add your offering to the Master Catalog.")
                        .font(.system(size: 13))
                        .foregroundColor(.manaTextSecondary)
                        .multilineTextAlignment(.center)
                }
                .padding(24)
            } else {
                ScrollView {
                    VStack(spacing: 14) {
                        CustomFormField(label: "Offering Name", placeholder: "e.g. Premium SEO & GBP Optimization", text: $name)
                        
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Category")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.manaTextSecondary)
                            Picker("Category", selection: $category) {
                                ForEach(categories, id: \.self) { c in
                                    Text(c).tag(c)
                                }
                            }
                            .pickerStyle(.menu)
                            .padding(8)
                            .background(Color.manaSurfaceDark)
                            .cornerRadius(10)
                        }

                        VStack(alignment: .leading, spacing: 6) {
                            Text("Offering Type")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.manaTextSecondary)
                            Picker("Type", selection: $type) {
                                Text("Service").tag("SERVICE")
                                Text("Product").tag("PRODUCT")
                            }
                            .pickerStyle(.segmented)
                        }

                        CustomFormField(label: "Standard Price (₹)", placeholder: "e.g. 7999", text: $price)
                        CustomFormField(label: "Description / Notes", placeholder: "Describe what's included in this service...", text: $description)

                        Button(action: onSubmit) {
                            Text("Submit Catalog Request")
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
            }

            Spacer()
        }
        .background(Color.manaBackground.ignoresSafeArea())
    }
}

// MARK: - Catalog Item Detail / Customize Sheet
struct CatalogDetailSheet: View {
    let item: LibraryCatalogItem
    let onClose: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Capsule().fill(Color.gray.opacity(0.4)).frame(width: 40, height: 5).padding(.top, 10)

            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(item.name)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                    Text("\(item.type.uppercased()) • \(item.category)")
                        .font(.system(size: 12))
                        .foregroundColor(.manaViolet)
                }
                Spacer()
                Button(action: onClose) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(.manaTextSecondary)
                }
            }
            .padding(.horizontal, 16)

            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    Text("Standard Price:")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.manaTextSecondary)
                    Spacer()
                    Text(item.defaultPrice != nil ? "₹\(Int(item.defaultPrice!))" : "Custom Pricing")
                        .font(.system(size: 20, weight: .black))
                        .foregroundColor(.manaEmerald)
                }
                .padding(14)
                .background(Color.manaSurfaceDark)
                .cornerRadius(12)

                Text("Description & Deliverables")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.manaTextPrimary)

                Text(item.description ?? "Verified Super Admin catalog offering.")
                    .font(.system(size: 13))
                    .foregroundColor(.manaTextSecondary)
                    .padding(14)
                    .background(Color.manaSurfaceDark)
                    .cornerRadius(12)
            }
            .padding(.horizontal, 16)

            Spacer()
        }
        .background(Color.manaBackground.ignoresSafeArea())
    }
}
