import SwiftUI

struct PublicHomeView: View {
    let onSelectBusiness: (Business) -> Void
    let onNavigateToLogin: () -> Void
    let onNavigateToRegister: () -> Void

    @State private var searchQuery: String = ""
    @State private var selectedCity: String = "Tirupati"
    @State private var selectedCategory: String = "All"
    @State private var showClaimModal: Bool = false

    let cities = ["Tirupati", "Hyderabad", "Vijayawada", "Visakhapatnam", "Chennai", "Bangalore"]

    // Full 18 web categories replicated from manacity.in
    let categories = [
        "All", "Restaurants", "Hotels", "Beauty Spa", "Home Decor", "Ask Astro",
        "Wedding Planning", "Education", "Rent & Hire", "Hospitals", "Contractors",
        "Pet Shops", "PG/Hostels", "Real Estate", "Dentists", "Gym", "Loans",
        "Event Organisers", "Packers & Movers"
    ]

    let businesses = [
        Business(name: "Rajugari Ventures - Digital Agency", slug: "rajugariventures", category: "Services", city: "Tirupati", address: "Tuda Complex, Tirupati", phone: "+91 079979 91101", rating: 4.9, reviewCount: 63, description: "SEO, Google Ads & Local Business Growth"),
        Business(name: "Grand Spice Restaurant", slug: "grand-spice", category: "Restaurants", city: "Hyderabad", address: "Banjara Hills, Hyd", phone: "+91 9876543210", rating: 4.9, reviewCount: 142, description: "Authentic Biryani & Fine Dining"),
        Business(name: "Apex Dental Clinic", slug: "apex-dental", category: "Dentists", city: "Hyderabad", address: "Jubilee Hills, Hyd", phone: "+91 9123456789", rating: 4.8, reviewCount: 89, description: "Modern Dental Care & Orthodontics"),
        Business(name: "Royal Fitness Gym", slug: "royal-fitness", category: "Gym", city: "Bangalore", address: "Indiranagar, Blr", phone: "+91 9988776655", rating: 4.7, reviewCount: 56, description: "24/7 Gym with Personal Trainers")
    ]

    var body: some View {
        ZStack {
            Color.manaBackground.ignoresSafeArea()

            VStack(alignment: .leading, spacing: 14) {
                // Top Header with Official Logo & Brand Name
                HStack(spacing: 12) {
                    Image("AppIcon")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 44, height: 44)
                        .cornerRadius(10)

                    VStack(alignment: .leading, spacing: 2) {
                        Text("ManaCity")
                            .font(.system(size: 22, weight: .black))
                            .foregroundColor(.manaViolet)
                        Text("Smart Business Growth Platform")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(.manaTextSecondary)
                    }

                    Spacer()

                    Button(action: onNavigateToLogin) {
                        HStack(spacing: 4) {
                            Image(systemName: "person.circle.fill")
                                .font(.system(size: 18))
                            Text("Login")
                                .font(.system(size: 12, weight: .bold))
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Color.manaViolet)
                        .foregroundColor(.white)
                        .cornerRadius(16)
                    }
                }
                .padding(.horizontal)

                // Search Bar
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.manaTextSecondary)
                    TextField("Search 10,000+ verified businesses...", text: $searchQuery)
                        .foregroundColor(.manaTextPrimary)
                }
                .padding()
                .background(Color.manaSurfaceDark)
                .cornerRadius(14)
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.manaBorder, lineWidth: 1))
                .padding(.horizontal)

                // City Locality Filter Pills
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(cities, id: \.self) { city in
                            Button(action: { selectedCity = city }) {
                                HStack(spacing: 4) {
                                    Image(systemName: "mappin.and.ellipse")
                                        .font(.system(size: 11))
                                    Text(city)
                                        .font(.system(size: 12, weight: .bold))
                                }
                                .padding(.horizontal, 12)
                                .padding(.vertical, 8)
                                .background(selectedCity == city ? Color.manaViolet : Color.manaSurfaceDark)
                                .foregroundColor(selectedCity == city ? .white : .manaTextPrimary)
                                .cornerRadius(20)
                                .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color.manaBorder, lineWidth: 1))
                            }
                        }
                    }
                    .padding(.horizontal)
                }

                // Full 18 Web Category Pills
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(categories, id: \.self) { category in
                            Button(action: { selectedCategory = category }) {
                                Text(category)
                                    .font(.system(size: 12, weight: .semibold))
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 7)
                                    .background(selectedCategory == category ? Color.manaTeal : Color.manaSurfaceDark)
                                    .foregroundColor(selectedCategory == category ? .white : .manaTextPrimary)
                                    .cornerRadius(14)
                                    .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.manaBorder, lineWidth: 1))
                            }
                        }
                    }
                    .padding(.horizontal)
                }

                // Main Content Scroll Area
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {

                        // Quick Service Grid Banner Cards
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Explore Top Categories")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.manaTextPrimary)

                            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                                CategoryIconCard(name: "Restaurants", iconName: "fork.knife", color: .orange)
                                CategoryIconCard(name: "Hotels", iconName: "building.2.fill", color: .blue)
                                CategoryIconCard(name: "Beauty Spa", iconName: "sparkles", color: .pink)
                                CategoryIconCard(name: "Hospitals", iconName: "cross.case.fill", color: .red)
                                CategoryIconCard(name: "Real Estate", iconName: "house.fill", color: .purple)
                                CategoryIconCard(name: "Dentists", iconName: "stethoscope", color: .cyan)
                            }
                        }
                        .padding(.horizontal)

                        // Verified Business Listings Header
                        Text("Verified Local Businesses")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.manaTextPrimary)
                            .padding(.horizontal)

                        VStack(spacing: 12) {
                            ForEach(businesses) { biz in
                                VStack(alignment: .leading, spacing: 8) {
                                    HStack {
                                        Text(biz.name)
                                            .font(.system(size: 16, weight: .bold))
                                            .foregroundColor(.manaTextPrimary)
                                        if biz.isVerified {
                                            Image(systemName: "checkmark.seal.fill")
                                                .foregroundColor(.manaTeal)
                                        }
                                        Spacer()
                                        Button(action: { showClaimModal = true }) {
                                            Text("Claim")
                                                .font(.system(size: 11, weight: .bold))
                                                .foregroundColor(.manaAmber)
                                                .padding(.horizontal, 10)
                                                .padding(.vertical, 4)
                                                .background(Color.manaSurfaceDark)
                                                .cornerRadius(6)
                                        }
                                    }

                                    Text(biz.description)
                                        .font(.system(size: 13))
                                        .foregroundColor(.manaTextSecondary)

                                    HStack {
                                        Image(systemName: "star.fill")
                                            .foregroundColor(.manaAmber)
                                            .font(.system(size: 12))
                                        Text(String(format: "%.1f", biz.rating))
                                            .font(.system(size: 13, weight: .bold))
                                            .foregroundColor(.manaTextPrimary)
                                        Text("(\(biz.reviewCount) reviews)")
                                            .font(.system(size: 12))
                                            .foregroundColor(.manaTextSecondary)
                                        Spacer()
                                        Text(biz.city)
                                            .font(.system(size: 12, weight: .bold))
                                            .foregroundColor(.manaTeal)
                                    }
                                }
                                .manaGlassCard()
                                .onTapGesture { onSelectBusiness(biz) }
                            }
                        }
                        .padding(.horizontal)
                    }
                    .padding(.vertical, 6)
                }
            }
        }
        .sheet(isPresented: $showClaimModal) {
            VStack(spacing: 16) {
                Image("AppIcon")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 60, height: 60)
                    .cornerRadius(12)

                Text("Claim ManaCity Business")
                    .font(.title2)
                    .fontWeight(.bold)
                Text("Verify your ownership to manage leads and list your services on ManaCity.in.")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)

                Button("Submit Business Claim") {
                    showClaimModal = false
                }
                .buttonStyle(.borderedProminent)
            }
            .padding()
        }
    }
}

struct CategoryIconCard: View {
    let name: String
    let iconName: String
    let color: Color

    var body: some View {
        VStack(spacing: 6) {
            Image(systemName: iconName)
                .font(.system(size: 20))
                .foregroundColor(color)
            Text(name)
                .font(.system(size: 11, weight: .semibold))
                .foregroundColor(.manaTextPrimary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .background(Color.manaSurfaceDark)
        .cornerRadius(12)
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.manaBorder, lineWidth: 1))
    }
}

