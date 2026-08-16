import SwiftUI

struct PublicHomeView: View {
    let onSelectBusiness: (Business) -> Void
    let onNavigateToLogin: () -> Void
    let onNavigateToRegister: () -> Void

    @State private var searchQuery: String = ""
    @State private var selectedCity: String = "Tirupati"
    @State private var selectedCategory: String = "All"
    @State private var selectedTab: Int = 0
    @State private var showExploreSheet: Bool = false
    @State private var showCityPicker: Bool = false
    @State private var showClaimModal: Bool = false

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

    let businesses = [
        Business(name: "Sri Sai Electricals", slug: "sri-sai-electricals", category: "Electrician", city: "Tirupati", address: "Tuda Complex, Tirupati", phone: "+91 079979 91101", rating: 4.9, reviewCount: 128, description: "AC Services, Wiring, Commercial & Residential"),
        Business(name: "Kumar Restaurant", slug: "kumar-restaurant", category: "Multi Cuisine", city: "Tirupati", address: "Bhavani Nagar, Tirupati", phone: "+91 9876543210", rating: 4.8, reviewCount: 96, description: "Authentic Biryani, South Indian & Fine Dining"),
        Business(name: "VR Air Conditioning", slug: "vr-ac-services", category: "AC Services", city: "Tirupati", address: "AIR Bypass Road, Tirupati", phone: "+91 9123456789", rating: 4.7, reviewCount: 74, description: "Installation, Gas Filling & Quick Repair"),
        Business(name: "More Super Market", slug: "more-supermarket", category: "Super Market", city: "Tirupati", address: "KT Road, Tirupati", phone: "+91 9988776655", rating: 4.6, reviewCount: 152, description: "Daily Needs, Groceries & Household Items")
    ]

    var body: some View {
        ZStack(alignment: .bottom) {
            Color.manaBackground.ignoresSafeArea()

            VStack(spacing: 0) {
                // MARK: - Top Navigation Bar
                HStack(spacing: 12) {
                    // ManaCity Horizontal Logo
                    Image("LogoHorizontal")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(height: 34)

                    Spacer()

                    // City Locality Dropdown Button
                    Button(action: { showCityPicker.toggle() }) {
                        HStack(spacing: 4) {
                            Image(systemName: "mappin.circle.fill")
                                .font(.system(size: 13))
                                .foregroundColor(.manaTeal)
                            Text(selectedCity)
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(.manaTextPrimary)
                            Image(systemName: "chevron.down")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.manaTextSecondary)
                        }
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(Color.manaSurfaceDark)
                        .cornerRadius(20)
                        .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color.manaBorder, lineWidth: 1))
                    }

                    // Notification Bell with Badge
                    Button(action: onNavigateToLogin) {
                        ZStack(alignment: .topTrailing) {
                            Image(systemName: "bell.fill")
                                .font(.system(size: 18))
                                .foregroundColor(.manaTextPrimary)
                                .padding(8)
                                .background(Color.manaSurfaceDark)
                                .clipShape(Circle())
                                .overlay(Circle().stroke(Color.manaBorder, lineWidth: 1))

                            Text("3")
                                .font(.system(size: 9, weight: .black))
                                .foregroundColor(.white)
                                .padding(4)
                                .background(Color.red)
                                .clipShape(Circle())
                                .offset(x: 2, y: -2)
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 8)
                .padding(.bottom, 10)
                .background(Color.manaBackground)

                // MARK: - Main Scroll Content
                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 18) {
                        // Hero Header
                        VStack(alignment: .leading, spacing: 4) {
                            HStack(spacing: 6) {
                                Text("Find everything")
                                    .font(.system(size: 26, weight: .black))
                                    .foregroundColor(.manaTextPrimary)
                            }
                            HStack(spacing: 6) {
                                Text("near you in")
                                    .font(.system(size: 26, weight: .black))
                                    .foregroundColor(.manaTextPrimary)
                                Text(selectedCity)
                                    .font(.system(size: 26, weight: .black))
                                    .foregroundColor(.red)
                            }
                            Text("Trusted local businesses, services & instant quotes in one place.")
                                .font(.system(size: 13))
                                .foregroundColor(.manaTextSecondary)
                        }
                        .padding(.horizontal, 16)
                        .padding(.top, 6)

                        // Search Bar with Voice/Search icons
                        HStack(spacing: 10) {
                            Image(systemName: "magnifyingglass")
                                .foregroundColor(.manaTextSecondary)
                                .font(.system(size: 16))

                            TextField("Search services, shops, businesses...", text: $searchQuery)
                                .foregroundColor(.manaTextPrimary)
                                .font(.system(size: 14))

                            if !searchQuery.isEmpty {
                                Button(action: { searchQuery = "" }) {
                                    Image(systemName: "xmark.circle.fill")
                                        .foregroundColor(.manaTextSecondary)
                                }
                            } else {
                                Image(systemName: "mic.fill")
                                    .foregroundColor(.manaTextSecondary)
                                    .font(.system(size: 14))
                            }
                        }
                        .padding(.horizontal, 14)
                        .padding(.vertical, 12)
                        .background(Color.manaSurfaceDark)
                        .cornerRadius(14)
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.manaBorder, lineWidth: 1))
                        .padding(.horizontal, 16)

                        // Quick Category Grid (8 Top Categories)
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                Text("Popular Near You")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.manaTextPrimary)
                                Spacer()
                                Button(action: { showExploreSheet = true }) {
                                    Text("See all")
                                        .font(.system(size: 13, weight: .semibold))
                                        .foregroundColor(.manaViolet)
                                }
                            }
                            .padding(.horizontal, 16)

                            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                                ForEach(quickCategories, id: \.name) { cat in
                                    Button(action: {
                                        if cat.name == "More" {
                                            showExploreSheet = true
                                        } else {
                                            selectedCategory = cat.name
                                        }
                                    }) {
                                        VStack(spacing: 8) {
                                            ZStack {
                                                RoundedRectangle(cornerRadius: 14)
                                                    .fill(cat.color.opacity(0.12))
                                                    .frame(width: 52, height: 52)
                                                Image(systemName: cat.icon)
                                                    .font(.system(size: 22))
                                                    .foregroundColor(cat.color)
                                            }
                                            Text(cat.name)
                                                .font(.system(size: 11, weight: .medium))
                                                .foregroundColor(.manaTextPrimary)
                                                .multilineTextAlignment(.center)
                                                .lineLimit(1)
                                        }
                                    }
                                }
                            }
                            .padding(.horizontal, 16)
                        }

                        // Promotional Business Banner (Get More Leads)
                        HStack(spacing: 14) {
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Need something? We've got you.")
                                    .font(.system(size: 15, weight: .bold))
                                    .foregroundColor(.white)
                                Text("Explore 120+ categories and connect with top verified local vendors.")
                                    .font(.system(size: 11))
                                    .foregroundColor(.white.opacity(0.85))

                                Button(action: onNavigateToRegister) {
                                    Text("List Your Business")
                                        .font(.system(size: 12, weight: .bold))
                                        .foregroundColor(.manaBackground)
                                        .padding(.horizontal, 14)
                                        .padding(.vertical, 6)
                                        .background(Color.white)
                                        .cornerRadius(12)
                                }
                                .padding(.top, 4)
                            }

                            Spacer()

                            Image("LogoSquare")
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 70, height: 70)
                                .cornerRadius(14)
                        }
                        .padding(16)
                        .background(LinearGradient(colors: [Color.manaViolet, Color.blue], startPoint: .topLeading, endPoint: .bottomTrailing))
                        .cornerRadius(18)
                        .padding(.horizontal, 16)

                        // Recommended Businesses List
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                Text("Recommended for You")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.manaTextPrimary)
                                Spacer()
                                Button(action: {}) {
                                    Text("See all")
                                        .font(.system(size: 13, weight: .semibold))
                                        .foregroundColor(.manaViolet)
                                }
                            }
                            .padding(.horizontal, 16)

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 14) {
                                    ForEach(businesses, id: \.slug) { b in
                                        Button(action: { onSelectBusiness(b) }) {
                                            VStack(alignment: .leading, spacing: 8) {
                                                ZStack(alignment: .topTrailing) {
                                                    RoundedRectangle(cornerRadius: 14)
                                                        .fill(Color.manaSurfaceDark)
                                                        .frame(width: 170, height: 100)
                                                        .overlay(
                                                            Image(systemName: "building.2.crop.circle.fill")
                                                                .font(.system(size: 40))
                                                                .foregroundColor(.manaTeal.opacity(0.6))
                                                        )

                                                    HStack(spacing: 3) {
                                                        Image(systemName: "star.fill")
                                                            .font(.system(size: 10))
                                                            .foregroundColor(.yellow)
                                                        Text(String(format: "%.1f", b.rating))
                                                            .font(.system(size: 11, weight: .bold))
                                                            .foregroundColor(.white)
                                                    }
                                                    .padding(.horizontal, 6)
                                                    .padding(.vertical, 3)
                                                    .background(Color.black.opacity(0.7))
                                                    .cornerRadius(8)
                                                    .padding(8)
                                                }

                                                Text(b.name)
                                                    .font(.system(size: 13, weight: .bold))
                                                    .foregroundColor(.manaTextPrimary)
                                                    .lineLimit(1)

                                                Text(b.category)
                                                    .font(.system(size: 11))
                                                    .foregroundColor(.manaTextSecondary)

                                                HStack {
                                                    Text("Open Now")
                                                        .font(.system(size: 10, weight: .semibold))
                                                        .foregroundColor(.green)
                                                    Spacer()
                                                    Text(b.city)
                                                        .font(.system(size: 10))
                                                        .foregroundColor(.manaTextSecondary)
                                                }
                                            }
                                            .frame(width: 170)
                                            .padding(10)
                                            .background(Color.manaSurfaceDark)
                                            .cornerRadius(16)
                                            .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.manaBorder, lineWidth: 1))
                                        }
                                    }
                                }
                                .padding(.horizontal, 16)
                            }
                        }

                        // Bottom Spacing for Floating TabBar
                        Spacer().frame(height: 80)
                    }
                }
            }

            // MARK: - Bottom 5-Tab Navigation Bar
            HStack(spacing: 0) {
                // Tab 1: Home
                Button(action: { selectedTab = 0 }) {
                    VStack(spacing: 4) {
                        Image(systemName: "house.fill")
                            .font(.system(size: 18))
                        Text("Home")
                            .font(.system(size: 10, weight: .bold))
                    }
                    .foregroundColor(selectedTab == 0 ? .manaViolet : .manaTextSecondary)
                    .frame(maxWidth: .infinity)
                }

                // Tab 2: Track / Leads
                Button(action: { selectedTab = 1; onNavigateToLogin() }) {
                    VStack(spacing: 4) {
                        Image(systemName: "shippingbox.fill")
                            .font(.system(size: 18))
                        Text("Track")
                            .font(.system(size: 10, weight: .semibold))
                    }
                    .foregroundColor(selectedTab == 1 ? .manaViolet : .manaTextSecondary)
                    .frame(maxWidth: .infinity)
                }

                // Tab 3: Center Elevated Action (Explore / Search)
                Button(action: { showExploreSheet = true }) {
                    ZStack {
                        Circle()
                            .fill(LinearGradient(colors: [Color.manaViolet, Color.blue], startPoint: .topLeading, endPoint: .bottomTrailing))
                            .frame(width: 52, height: 52)
                            .shadow(color: Color.manaViolet.opacity(0.4), radius: 8, y: 4)
                        Image(systemName: "magnifyingglass")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                    }
                }
                .offset(y: -14)
                .frame(maxWidth: .infinity)

                // Tab 4: Alerts
                Button(action: { selectedTab = 3; onNavigateToLogin() }) {
                    VStack(spacing: 4) {
                        Image(systemName: "bell.fill")
                            .font(.system(size: 18))
                        Text("Alerts")
                            .font(.system(size: 10, weight: .semibold))
                    }
                    .foregroundColor(selectedTab == 3 ? .manaViolet : .manaTextSecondary)
                    .frame(maxWidth: .infinity)
                }

                // Tab 5: Profile / Login
                Button(action: { selectedTab = 4; onNavigateToLogin() }) {
                    VStack(spacing: 4) {
                        Image(systemName: "person.crop.circle.fill")
                            .font(.system(size: 18))
                        Text("Profile")
                            .font(.system(size: 10, weight: .semibold))
                    }
                    .foregroundColor(selectedTab == 4 ? .manaViolet : .manaTextSecondary)
                    .frame(maxWidth: .infinity)
                }
            }
            .padding(.horizontal, 8)
            .padding(.top, 10)
            .padding(.bottom, 22)
            .background(Color.manaSurfaceDark.ignoresSafeArea(edges: .bottom))
            .overlay(
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(Color.manaBorder),
                alignment: .top
            )
        }
        // Explore Categories Bottom Sheet
        .sheet(isPresented: $showExploreSheet) {
            VStack(spacing: 16) {
                Capsule()
                    .fill(Color.gray.opacity(0.4))
                    .frame(width: 40, height: 5)
                    .padding(.top, 8)

                HStack {
                    Text("Explore All Categories")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                    Spacer()
                    Button(action: { showExploreSheet = false }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 22))
                            .foregroundColor(.manaTextSecondary)
                    }
                }
                .padding(.horizontal)

                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 14) {
                    ForEach(quickCategories, id: \.name) { cat in
                        VStack(spacing: 8) {
                            ZStack {
                                RoundedRectangle(cornerRadius: 14)
                                    .fill(cat.color.opacity(0.12))
                                    .frame(width: 54, height: 54)
                                Image(systemName: cat.icon)
                                    .font(.system(size: 22))
                                    .foregroundColor(cat.color)
                            }
                            Text(cat.name)
                                .font(.system(size: 11, weight: .medium))
                                .foregroundColor(.manaTextPrimary)
                                .multilineTextAlignment(.center)
                        }
                    }
                }
                .padding()

                Spacer()
            }
            .background(Color.manaBackground)
        }
        // City Picker Sheet
        .sheet(isPresented: $showCityPicker) {
            VStack(alignment: .leading, spacing: 16) {
                Capsule()
                    .fill(Color.gray.opacity(0.4))
                    .frame(width: 40, height: 5)
                    .frame(maxWidth: .infinity)
                    .padding(.top, 8)

                Text("Select Locality / City")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(.manaTextPrimary)
                    .padding(.horizontal)

                ForEach(cities, id: \.self) { city in
                    Button(action: {
                        selectedCity = city
                        showCityPicker = false
                    }) {
                        HStack {
                            Image(systemName: "mappin.circle.fill")
                                .foregroundColor(selectedCity == city ? .manaViolet : .manaTextSecondary)
                            Text(city)
                                .font(.system(size: 16, weight: selectedCity == city ? .bold : .regular))
                                .foregroundColor(.manaTextPrimary)
                            Spacer()
                            if selectedCity == city {
                                Image(systemName: "checkmark")
                                    .foregroundColor(.manaViolet)
                            }
                        }
                        .padding()
                        .background(Color.manaSurfaceDark)
                        .cornerRadius(12)
                        .padding(.horizontal)
                    }
                }

                Spacer()
            }
            .background(Color.manaBackground)
        }
    }
}
