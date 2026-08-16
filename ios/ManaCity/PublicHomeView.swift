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
    
    // Live Backend Data & Carousel
    @State private var liveBusinesses: [Business] = []
    @State private var isLoadingLive: Bool = false
    @State private var scrollIndex: Int = 0

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

                    // Sign In Icon Button in Top Bar (Icon Only)
                    Button(action: onNavigateToLogin) {
                        Image(systemName: "person.crop.circle.badge.plus")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.manaViolet)
                            .padding(8)
                            .background(Color.manaViolet.opacity(0.12))
                            .clipShape(Circle())
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
                            Text("Find everything near you in")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.manaTextSecondary)
                            HStack(spacing: 6) {
                                Text(selectedCity)
                                    .font(.system(size: 24, weight: .black))
                                    .foregroundColor(.manaViolet)
                                Image(systemName: "chevron.down")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.manaViolet)
                            }
                            .onTapGesture {
                                showCityPicker = true
                            }
                        }
                        .padding(.horizontal, 16)

                        // Search Bar
                        HStack(spacing: 10) {
                            Image(systemName: "magnifyingglass")
                                .foregroundColor(.manaTextSecondary)
                            TextField("Search restaurants, doctors, services...", text: $searchQuery)
                                .font(.system(size: 14))
                                .foregroundColor(.manaTextPrimary)
                            if !searchQuery.isEmpty {
                                Button(action: { searchQuery = "" }) {
                                    Image(systemName: "xmark.circle.fill")
                                        .foregroundColor(.manaTextSecondary)
                                }
                            }
                        }
                        .padding(.horizontal, 14)
                        .padding(.vertical, 12)
                        .background(Color.manaSurfaceDark)
                        .cornerRadius(14)
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.manaBorder, lineWidth: 1))
                        .padding(.horizontal, 16)

                        // Quick Categories Grid
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Categories")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.manaTextPrimary)

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 12) {
                                    ForEach(quickCategories, id: \.name) { cat in
                                        Button(action: {
                                            selectedCategory = (selectedCategory == cat.name) ? "All" : cat.name
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
                                                    .foregroundColor(selectedCategory == cat.name ? cat.color : .manaTextPrimary)
                                            }
                                            .padding(.vertical, 8)
                                            .padding(.horizontal, 10)
                                            .background(selectedCategory == cat.name ? cat.color.opacity(0.1) : Color.manaSurfaceDark)
                                            .cornerRadius(14)
                                            .overlay(
                                                RoundedRectangle(cornerRadius: 14)
                                                    .stroke(selectedCategory == cat.name ? cat.color : Color.manaBorder, lineWidth: 1)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                        .padding(.horizontal, 16)

                        // Recommended Local Businesses Section (Horizontal Auto-Scroll Carousel)
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                Text("Top Verified Listings")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.manaTextPrimary)
                                Spacer()
                                if isLoadingLive {
                                    ProgressView()
                                        .scaleEffect(0.8)
                                }
                            }
                            .padding(.horizontal, 16)

                            ScrollViewReader { proxy in
                                ScrollView(.horizontal, showsIndicators: false) {
                                    HStack(spacing: 16) {
                                        ForEach(displayBusinesses, id: \.slug) { b in
                                            VStack(alignment: .leading, spacing: 0) {
                                                // Top Banner with Category, Rating, and Verified Badges
                                                ZStack(alignment: .top) {
                                                    if let cover = b.coverImage, !cover.isEmpty, let url = URL(string: cover) {
                                                        AsyncImage(url: url) { phase in
                                                            switch phase {
                                                            case .success(let img):
                                                                img.resizable().aspectRatio(contentMode: .fill)
                                                            default:
                                                                ZStack {
                                                                    LinearGradient(colors: [Color.manaViolet.opacity(0.85), Color.blue.opacity(0.85)], startPoint: .topLeading, endPoint: .bottomTrailing)
                                                                    Image(systemName: b.category.contains("Clinic") ? "cross.case.fill" : b.category.contains("Digital") ? "laptopcomputer" : "building.2.fill")
                                                                        .font(.system(size: 45))
                                                                        .foregroundColor(.white.opacity(0.25))
                                                                }
                                                            }
                                                        }
                                                        .frame(width: 260, height: 115)
                                                        .clipped()
                                                    } else {
                                                        ZStack {
                                                            LinearGradient(colors: [Color.manaViolet.opacity(0.85), Color.blue.opacity(0.85)], startPoint: .topLeading, endPoint: .bottomTrailing)
                                                            Image(systemName: b.category.contains("Clinic") ? "cross.case.fill" : b.category.contains("Digital") ? "laptopcomputer" : "building.2.fill")
                                                                .font(.system(size: 45))
                                                                .foregroundColor(.white.opacity(0.25))
                                                        }
                                                        .frame(width: 260, height: 115)
                                                        .clipped()
                                                    }

                                                    HStack {
                                                        Text(b.category)
                                                            .font(.system(size: 10, weight: .bold))
                                                            .foregroundColor(.blue)
                                                            .padding(.horizontal, 8)
                                                            .padding(.vertical, 4)
                                                            .background(Color.white)
                                                            .cornerRadius(12)

                                                        Spacer()

                                                        HStack(spacing: 3) {
                                                            Image(systemName: "star.fill")
                                                                .font(.system(size: 9))
                                                                .foregroundColor(.yellow)
                                                            Text(String(format: "%.1f", b.rating))
                                                                .font(.system(size: 10, weight: .bold))
                                                                .foregroundColor(.white)
                                                        }
                                                        .padding(.horizontal, 7)
                                                        .padding(.vertical, 4)
                                                        .background(Color.black.opacity(0.65))
                                                        .cornerRadius(12)
                                                    }
                                                    .padding(10)
                                                }
                                                .frame(width: 260, height: 115)

                                                // Overlapping Logo Avatar & Details
                                                VStack(alignment: .leading, spacing: 10) {
                                                    HStack(alignment: .bottom) {
                                                        ZStack(alignment: .bottomTrailing) {
                                                            if let logo = b.logoUrl, !logo.isEmpty, let url = URL(string: logo) {
                                                                AsyncImage(url: url) { phase in
                                                                    switch phase {
                                                                    case .success(let img):
                                                                        img.resizable().aspectRatio(contentMode: .fill)
                                                                    default:
                                                                        Text(b.name.prefix(2).uppercased())
                                                                            .font(.system(size: 18, weight: .black))
                                                                            .foregroundColor(.manaTeal)
                                                                    }
                                                                }
                                                                .frame(width: 52, height: 52)
                                                                .clipShape(Circle())
                                                                .overlay(Circle().stroke(Color.white, lineWidth: 2.5))
                                                                .shadow(color: Color.black.opacity(0.15), radius: 4, y: 2)
                                                            } else {
                                                                Circle()
                                                                    .fill(LinearGradient(colors: [.manaTeal.opacity(0.2), .manaViolet.opacity(0.2)], startPoint: .topLeading, endPoint: .bottomTrailing))
                                                                    .frame(width: 52, height: 52)
                                                                    .overlay(
                                                                        Text(b.name.prefix(2).uppercased())
                                                                            .font(.system(size: 18, weight: .black))
                                                                            .foregroundColor(.manaTeal)
                                                                    )
                                                                    .overlay(Circle().stroke(Color.white, lineWidth: 2.5))
                                                                    .shadow(color: Color.black.opacity(0.15), radius: 4, y: 2)
                                                            }

                                                            if b.isVerified {
                                                                Image(systemName: "checkmark.seal.fill")
                                                                    .font(.system(size: 15))
                                                                    .foregroundColor(.green)
                                                                    .background(Circle().fill(Color.white))
                                                                    .offset(x: 2, y: 2)
                                                            }
                                                        }
                                                        .offset(y: -22)

                                                        Spacer()

                                                        // Verified / Unverified Badge
                                                        if b.isVerified {
                                                            HStack(spacing: 3) {
                                                                Image(systemName: "checkmark.shield.fill")
                                                                    .font(.system(size: 10))
                                                                Text("Verified")
                                                                    .font(.system(size: 10, weight: .bold))
                                                            }
                                                            .foregroundColor(.green)
                                                            .padding(.horizontal, 8)
                                                            .padding(.vertical, 3)
                                                            .background(Color.green.opacity(0.12))
                                                            .cornerRadius(10)
                                                        } else {
                                                            Text("Unverified")
                                                                .font(.system(size: 10, weight: .bold))
                                                                .foregroundColor(.orange)
                                                                .padding(.horizontal, 8)
                                                                .padding(.vertical, 3)
                                                                .background(Color.orange.opacity(0.12))
                                                                .cornerRadius(10)
                                                        }
                                                    }
                                                    .frame(height: 30)

                                                    Button(action: { onSelectBusiness(b) }) {
                                                        Text(b.name)
                                                            .font(.system(size: 14, weight: .bold))
                                                            .foregroundColor(.manaTextPrimary)
                                                            .lineLimit(1)
                                                    }

                                                    Text(b.address)
                                                        .font(.system(size: 11))
                                                        .foregroundColor(.manaTextSecondary)
                                                        .lineLimit(2)

                                                    // Call, WhatsApp & Get Quote Action Buttons
                                                    HStack(spacing: 6) {
                                                        Button(action: {
                                                            if let phoneUrl = URL(string: "tel://\(b.phone.replacingOccurrences(of: " ", with: ""))") {
                                                                UIApplication.shared.open(phoneUrl)
                                                            }
                                                        }) {
                                                            HStack(spacing: 4) {
                                                                Image(systemName: "phone.fill")
                                                                    .font(.system(size: 10))
                                                                Text("Call")
                                                                    .font(.system(size: 11, weight: .bold))
                                                            }
                                                            .foregroundColor(.white)
                                                            .padding(.vertical, 6)
                                                            .frame(maxWidth: .infinity)
                                                            .background(Color.green)
                                                            .cornerRadius(8)
                                                        }

                                                        Button(action: {
                                                            if let waUrl = URL(string: "https://wa.me/\(b.phone.replacingOccurrences(of: " ", with: "").replacingOccurrences(of: "+", with: ""))") {
                                                                UIApplication.shared.open(waUrl)
                                                            }
                                                        }) {
                                                            HStack(spacing: 4) {
                                                                Image(systemName: "message.fill")
                                                                    .font(.system(size: 10))
                                                                Text("WhatsApp")
                                                                    .font(.system(size: 11, weight: .bold))
                                                            }
                                                            .foregroundColor(.white)
                                                            .padding(.vertical, 6)
                                                            .frame(maxWidth: .infinity)
                                                            .background(Color(red: 0.15, green: 0.83, blue: 0.40))
                                                            .cornerRadius(8)
                                                        }
                                                    }

                                                    Button(action: { onSelectBusiness(b) }) {
                                                        HStack(spacing: 4) {
                                                            Image(systemName: "bolt.fill")
                                                                .font(.system(size: 11))
                                                            Text("Get Best Quote")
                                                                .font(.system(size: 11, weight: .bold))
                                                        }
                                                        .foregroundColor(.manaViolet)
                                                        .padding(.vertical, 6)
                                                        .frame(maxWidth: .infinity)
                                                        .background(Color.manaViolet.opacity(0.12))
                                                        .cornerRadius(8)
                                                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.manaViolet.opacity(0.3), lineWidth: 1))
                                                    }
                                                }
                                                .padding(12)
                                            }
                                            .id(b.slug)
                                            .frame(width: 260)
                                            .background(Color.manaSurfaceDark)
                                            .cornerRadius(18)
                                            .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color.manaBorder, lineWidth: 1.5))
                                        }
                                    }
                                    .padding(.horizontal, 16)
                                }
                                .onReceive(Timer.publish(every: 3.5, on: .main, in: .common).autoconnect()) { _ in
                                    guard !displayBusinesses.isEmpty else { return }
                                    withAnimation(.easeInOut(duration: 0.5)) {
                                        scrollIndex = (scrollIndex + 1) % displayBusinesses.count
                                        let targetSlug = displayBusinesses[scrollIndex].slug
                                        proxy.scrollTo(targetSlug, anchor: .center)
                                    }
                                }
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
        .onChange(of: selectedCity) { _ in
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
        let cityParam = selectedCity.lowercased()
        guard let url = URL(string: "https://manacity.in/api/phase1/directory/\(cityParam)/all") else { return }
        
        URLSession.shared.dataTask(with: url) { data, response, error in
            DispatchQueue.main.async {
                self.isLoadingLive = false
                guard let data = data,
                      let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                      let array = json["listings"] as? [[String: Any]] else { return }

                let fetched = array.compactMap { item -> Business? in
                    guard let name = (item["businessName"] as? String) ?? (item["name"] as? String) else { return nil }
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
                        description: item["description"] as? String ?? "Verified Local Business",
                        logoUrl: item["logoUrl"] as? String ?? item["logo"] as? String,
                        coverImage: item["coverImage"] as? String ?? item["banner"] as? String
                    )
                }
                if !fetched.isEmpty {
                    self.liveBusinesses = fetched
                }
            }
        }.resume()
    }
}
