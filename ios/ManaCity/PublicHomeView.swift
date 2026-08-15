import SwiftUI

struct PublicHomeView: View {
    let onSelectBusiness: (Business) -> Void
    let onNavigateToLogin: () -> Void
    let onNavigateToRegister: () -> Void

    @State private var searchQuery: String = ""
    @State private var selectedCity: String = "Hyderabad"
    @State private var selectedCategory: String = "All"
    @State private var showClaimModal: Bool = false

    let cities = ["Hyderabad", "Bengaluru", "Mumbai", "Chennai", "Delhi"]
    let categories = ["All", "Dining & Food", "Healthcare", "Fitness", "Services", "Shopping"]

    let businesses = [
        Business(name: "Grand Spice Restaurant", slug: "grand-spice", category: "Dining & Food", city: "Hyderabad", address: "Banjara Hills, Hyd", phone: "+91 9876543210", rating: 4.9, reviewCount: 142, description: "Authentic Biryani & Fine Dining"),
        Business(name: "Apex Dental Clinic", slug: "apex-dental", category: "Healthcare", city: "Hyderabad", address: "Jubilee Hills, Hyd", phone: "+91 9123456789", rating: 4.8, reviewCount: 89, description: "Modern Dental Care & Orthodontics"),
        Business(name: "Royal Fitness Gym", slug: "royal-fitness", category: "Fitness", city: "Bengaluru", address: "Indiranagar, Blr", phone: "+91 9988776655", rating: 4.7, reviewCount: 56, description: "24/7 Gym with Personal Trainers")
    ]

    var body: some View {
        ZStack {
            Color.manaBackground.ignoresSafeArea()

            VStack(alignment: .leading, spacing: 14) {
                // Top App Bar Header
                HStack {
                    VStack(alignment: .leading) {
                        Text("ManaCity")
                            .font(.system(size: 24, weight: .black))
                            .foregroundColor(.manaViolet)
                        Text("Discover Local Verified Businesses")
                            .font(.system(size: 12))
                            .foregroundColor(.manaTextSecondary)
                    }
                    Spacer()
                    Button(action: onNavigateToLogin) {
                        Image(systemName: "person.circle.fill")
                            .font(.system(size: 26))
                            .foregroundColor(.manaTeal)
                    }
                }
                .padding(.horizontal)

                // Search Bar
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.manaTextSecondary)
                    TextField("Search places, doctors, services...", text: $searchQuery)
                        .foregroundColor(.manaTextPrimary)
                }
                .padding()
                .background(Color.manaSurfaceDark)
                .cornerRadius(14)
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.manaBorder, lineWidth: 1))
                .padding(.horizontal)

                // City Filter Pills
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
                                .foregroundColor(.white)
                                .cornerRadius(20)
                            }
                        }
                    }
                    .padding(.horizontal)
                }

                // Category Filter Pills
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(categories, id: \.self) { category in
                            Button(action: { selectedCategory = category }) {
                                Text(category)
                                    .font(.system(size: 12))
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(selectedCategory == category ? Color.manaTeal : Color.manaSurfaceDark)
                                    .foregroundColor(.white)
                                    .cornerRadius(14)
                            }
                        }
                    }
                    .padding(.horizontal)
                }

                // Business Listings List
                ScrollView {
                    VStack(spacing: 12) {
                        ForEach(businesses) { biz in
                            VStack(alignment: .leading, spacing: 8) {
                                HStack {
                                    Text(biz.name)
                                        .font(.system(size: 17, weight: .bold))
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
                                        .font(.system(size: 12))
                                        .foregroundColor(.manaTeal)
                                }
                            }
                            .manaGlassCard()
                            .onTapGesture { onSelectBusiness(biz) }
                        }
                    }
                    .padding(.horizontal)
                }
            }
        }
        .sheet(isPresented: $showClaimModal) {
            VStack(spacing: 16) {
                Text("Claim Business Ownership")
                    .font(.title2)
                    .fontWeight(.bold)
                Text("Verify your identity and get instant access to the ManaCity Admin Dashboard.")
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
