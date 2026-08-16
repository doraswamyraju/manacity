import SwiftUI

struct PublicHomeView: View {
    let onSelectBusiness: (Business) -> Void
    let onNavigateToLogin: () -> Void
    let onNavigateToRegister: () -> Void

    @State private var searchQuery: String = ""
    @State private var selectedCity: String = "Tirupati"
    @State private var selectedCategory: String = "All"
    @State private var selectedTab: Int = 0
    
    // Bottom Sheet Controls
    @State private var showServicesSheet: Bool = false
    @State private var showEnquiriesSheet: Bool = false
    @State private var showCityPicker: Bool = false
    
    // Live Backend Data
    @State private var liveBusinesses: [Business] = []
    @State private var isLoadingLive: Bool = false

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

    let fallbackBusinesses = [
        Business(name: "Sri Sai Electricals", slug: "sri-sai-electricals", category: "Electrician", city: "Tirupati", address: "Tuda Complex, Tirupati", phone: "+91 079979 91101", rating: 4.9, reviewCount: 128, description: "AC Services, Wiring, Commercial & Residential"),
        Business(name: "Kumar Restaurant", slug: "kumar-restaurant", category: "Multi Cuisine", city: "Tirupati", address: "Bhavani Nagar, Tirupati", phone: "+91 9876543210", rating: 4.8, reviewCount: 96, description: "Authentic Biryani, South Indian & Fine Dining"),
        Business(name: "VR Air Conditioning", slug: "vr-ac-services", category: "AC Services", city: "Tirupati", address: "AIR Bypass Road, Tirupati", phone: "+91 9123456789", rating: 4.7, reviewCount: 74, description: "Installation, Gas Filling & Quick Repair"),
        Business(name: "More Super Market", slug: "more-supermarket", category: "Super Market", city: "Tirupati", address: "KT Road, Tirupati", phone: "+91 9988776655", rating: 4.6, reviewCount: 152, description: "Daily Needs, Groceries & Household Items")
    ]

    var displayBusinesses: [Business] {
        return liveBusinesses.isEmpty ? fallbackBusinesses : liveBusinesses
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
                // MARK: - Top Navigation Bar
                HStack(spacing: 12) {
                    // ManaCity Horizontal Logo
                    ManaLogoView(type: .horizontal, height: 34)

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

                    // Notification Bell (Alerts Icon)
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

                        // Search Bar
                        HStack(spacing: 10) {
                            Image(systemName: "magnifyingglass")
                                .foregroundColor(.manaViolet)
                                .font(.system(size: 16, weight: .bold))

                            TextField("Search electricians, doctors, restaurants...", text: $searchQuery)
                                .font(.system(size: 14))
                                .foregroundColor(.manaTextPrimary)
                        }
                        .padding(.horizontal, 14)
                        .padding(.vertical, 12)
                        .background(Color.manaSurfaceDark)
                        .cornerRadius(14)
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.manaBorder, lineWidth: 1.5))
                        .padding(.horizontal, 16)

                        // Quick Categories Grid
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 12) {
                                ForEach(quickCategories, id: \.name) { cat in
                                    Button(action: {
                                        selectedCategory = cat.name
                                        showServicesSheet = true
                                    }) {
                                        VStack(spacing: 6) {
                                            ZStack {
                                                Circle()
                                                    .fill(cat.color.opacity(0.12))
                                                    .frame(width: 48, height: 48)
                                                Image(systemName: cat.icon)
                                                    .font(.system(size: 20))
                                                    .foregroundColor(cat.color)
                                            }
                                            Text(cat.name)
                                                .font(.system(size: 11, weight: .semibold))
                                                .foregroundColor(.manaTextPrimary)
                                        }
                                        .frame(width: 72)
                                    }
                                }
                            }
                            .padding(.horizontal, 16)
                        }

                        // Banner Promotion Card
                        HStack {
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Grow Your Business 10x")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.white)
                                Text("Get verified leads & your own smart website in Tirupati.")
                                    .font(.system(size: 12))
                                    .foregroundColor(.white.opacity(0.85))

                                Button(action: onNavigateToRegister) {
                                    Text("List Your Business")
                                        .font(.system(size: 12, weight: .black))
                                        .foregroundColor(Color.manaViolet)
                                        .padding(.horizontal, 14)
                                        .padding(.vertical, 6)
                                        .background(Color.white)
                                        .cornerRadius(12)
                                }
                                .padding(.top, 4)
                            }

                            Spacer()

                            ManaLogoView(type: .square, height: 60)
                        }
                        .padding(16)
                        .background(LinearGradient(colors: [Color.manaViolet, Color.blue], startPoint: .topLeading, endPoint: .bottomTrailing))
                        .cornerRadius(18)
                        .padding(.horizontal, 16)

                        // Recommended Live Businesses List
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                Text("Recommended Local Businesses")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.manaTextPrimary)
                                Spacer()
                                if isLoadingLive {
                                    ProgressView()
                                        .scaleEffect(0.8)
                                }
                            }
                            .padding(.horizontal, 16)

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 14) {
                                    ForEach(displayBusinesses, id: \.slug) { b in
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
                                                    Text("Verified")
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

                        Spacer().frame(height: 90)
                    }
                }
            }

            // MARK: - 2-Part Split Bottom Navbar (Left: Home/Track/Profile, Right: ManaCity Search Action)
            HStack(spacing: 12) {
                // Left Segment: Home, Track, Profile
                HStack(spacing: 0) {
                    Button(action: { selectedTab = 0 }) {
                        VStack(spacing: 4) {
                            Image(systemName: "house.fill")
                                .font(.system(size: 17))
                            Text("Home")
                                .font(.system(size: 10, weight: .bold))
                        }
                        .foregroundColor(selectedTab == 0 ? .manaViolet : .manaTextSecondary)
                        .frame(maxWidth: .infinity)
                    }

                    Button(action: {
                        selectedTab = 1
                        showEnquiriesSheet = true
                    }) {
                        VStack(spacing: 4) {
                            Image(systemName: "shippingbox.fill")
                                .font(.system(size: 17))
                            Text("Track")
                                .font(.system(size: 10, weight: .semibold))
                        }
                        .foregroundColor(selectedTab == 1 ? .manaViolet : .manaTextSecondary)
                        .frame(maxWidth: .infinity)
                    }

                    Button(action: {
                        selectedTab = 2
                        onNavigateToLogin()
                    }) {
                        VStack(spacing: 4) {
                            Image(systemName: "person.crop.circle.fill")
                                .font(.system(size: 17))
                            Text("Profile")
                                .font(.system(size: 10, weight: .semibold))
                        }
                        .foregroundColor(selectedTab == 2 ? .manaViolet : .manaTextSecondary)
                        .frame(maxWidth: .infinity)
                    }
                }
                .padding(.vertical, 8)
                .background(Color.manaSurfaceDark)
                .cornerRadius(24)
                .overlay(RoundedRectangle(cornerRadius: 24).stroke(Color.manaBorder, lineWidth: 1.5))
                .gesture(
                    DragGesture().onEnded { value in
                        if value.translation.height < -25 {
                            showEnquiriesSheet = true
                        }
                    }
                )

                // Right Segment: Customized Elevated ManaCity Logo Search Action
                Button(action: { showServicesSheet = true }) {
                    HStack(spacing: 6) {
                        ManaLogoView(type: .square, height: 26)
                        Image(systemName: "magnifyingglass")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 16)
                    .frame(height: 50)
                    .background(
                        LinearGradient(colors: [.manaViolet, .manaTeal], startPoint: .leading, endPoint: .trailing)
                    )
                    .cornerRadius(25)
                    .shadow(color: Color.manaViolet.opacity(0.35), radius: 6, y: 3)
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
            .padding(.bottom, 16)
        }
        .onAppear {
            fetchLiveBusinesses()
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
                                .foregroundColor(.manaTeal)
                            Text(city)
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(.manaTextPrimary)
                            Spacer()
                            if selectedCity == city {
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundColor(.manaViolet)
                            }
                        }
                        .padding()
                        .background(Color.manaSurfaceDark)
                        .cornerRadius(12)
                    }
                    .padding(.horizontal)
                }
                Spacer()
            }
            .padding(.top)
        }
        // Left-side Enquiries Bottom Sheet
        .sheet(isPresented: $showEnquiriesSheet) {
            VStack(spacing: 18) {
                Capsule()
                    .fill(Color.gray.opacity(0.4))
                    .frame(width: 40, height: 5)
                    .padding(.top, 8)

                HStack {
                    Text("My Enquiries & Service Quotes")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                    Spacer()
                    Button(action: { showEnquiriesSheet = false }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 22))
                            .foregroundColor(.manaTextSecondary)
                    }
                }

                if isLoggedIn {
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Sri Sai Electricals")
                                    .font(.system(size: 15, weight: .bold))
                                    .foregroundColor(.manaTextPrimary)
                                Text("Catering & AC Wiring Inquiry")
                                    .font(.system(size: 12))
                                    .foregroundColor(.manaTextSecondary)
                            }
                            Spacer()
                            StatusBadge(status: "CONTACTED")
                        }
                        .padding()
                        .background(Color.manaSurfaceDark)
                        .cornerRadius(14)
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.manaBorder, lineWidth: 1))
                    }
                } else {
                    VStack(spacing: 12) {
                        Image(systemName: "lock.shield.fill")
                            .font(.system(size: 40))
                            .foregroundColor(.manaViolet)

                        Text("Sign In to Track Enquiries")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.manaTextPrimary)

                        Text("Please sign in to view status updates, quotes, and direct calls from local businesses.")
                            .font(.system(size: 13))
                            .foregroundColor(.manaTextSecondary)
                            .multilineTextAlignment(.center)

                        ManaGradientButton(title: "Sign In Now") {
                            showEnquiriesSheet = false
                            onNavigateToLogin()
                        }
                    }
                    .padding(20)
                    .background(Color.manaSurfaceDark)
                    .cornerRadius(16)
                    .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.manaBorder, lineWidth: 1))
                }

                Spacer()
            }
            .padding(.horizontal, 16)
            .background(Color.manaBackground.ignoresSafeArea())
        }
        // Right-side All Services & Search Bottom Sheet
        .sheet(isPresented: $showServicesSheet) {
            VStack(spacing: 16) {
                Capsule()
                    .fill(Color.gray.opacity(0.4))
                    .frame(width: 40, height: 5)
                    .padding(.top, 8)

                HStack {
                    ManaLogoView(type: .horizontal, height: 28)
                    Spacer()
                    Text("All Services")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                }

                HStack(spacing: 10) {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.manaViolet)
                    TextField("Search all local services...", text: $searchQuery)
                        .font(.system(size: 14))
                }
                .padding(12)
                .background(Color.manaSurfaceDark)
                .cornerRadius(12)
                .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.manaBorder, lineWidth: 1))

                ScrollView {
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
                    .padding(.vertical, 8)
                }

                Spacer()
            }
            .padding(.horizontal, 16)
            .background(Color.manaBackground.ignoresSafeArea())
        }
    }

    private func fetchLiveBusinesses() {
        isLoadingLive = true
        guard let url = URL(string: "https://manacity.in/api/businesses") else { return }
        URLSession.shared.dataTask(with: url) { data, response, error in
            DispatchQueue.main.async {
                isLoadingLive = false
                guard let data = data,
                      let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                      let array = json["businesses"] as? [[String: Any]] else { return }

                let fetched = array.compactMap { item -> Business? in
                    guard let name = item["name"] as? String else { return nil }
                    let category = item["category"] as? String ?? "Services"
                    let city = item["city"] as? String ?? "Tirupati"
                    let phone = item["phone"] as? String ?? "+91 9999999999"
                    let rating = item["rating"] as? Double ?? 4.8
                    let reviewCount = item["reviewCount"] as? Int ?? 45
                    let address = item["address"] as? String ?? city
                    return Business(
                        name: name,
                        slug: item["slug"] as? String ?? name.lowercased().replacingOccurrences(of: " ", with: "-"),
                        category: category,
                        city: city,
                        address: address,
                        phone: phone,
                        rating: rating,
                        reviewCount: reviewCount,
                        description: item["description"] as? String ?? "Verified Local Business"
                    )
                }
                if !fetched.isEmpty {
                    self.liveBusinesses = fetched
                }
            }
        }.resume()
    }
}
