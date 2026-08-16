import SwiftUI

struct LocationItem: Identifiable {
    let id: String
    let name: String
    let city: String
    let address: String
    let isPrimary: Bool
}

struct LocationsView: View {
    @State private var locations: [LocationItem] = [
        LocationItem(id: "1", name: "Tirupati Main Branch", city: "Tirupati", address: "Bairagi Patteda, Near Anna Canteen", isPrimary: true),
        LocationItem(id: "2", name: "Tirupati Railway Station Branch", city: "Tirupati", address: "VV Mahal Road, Opp Shubhamastu", isPrimary: false)
    ]

    @State private var showAddLocationModal: Bool = false
    @State private var newBranchName: String = ""
    @State private var newBranchCity: String = "Tirupati"
    @State private var newBranchAddress: String = ""

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                // Header Banner
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Business Locations")
                            .font(.system(size: 18, weight: .black))
                            .foregroundColor(.white)
                        Text("Manage all your store branches and clinics across Tirupati.")
                            .font(.system(size: 12))
                            .foregroundColor(.white.opacity(0.85))
                    }
                    Spacer()
                    Image(systemName: "building.2.crop.circle.fill")
                        .font(.system(size: 34))
                        .foregroundColor(.white.opacity(0.8))
                }
                .padding(16)
                .background(LinearGradient(colors: [.manaViolet, .blue], startPoint: .topLeading, endPoint: .bottomTrailing))
                .cornerRadius(16)

                HStack {
                    Text("Registered Branches (\(locations.count))")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                    Spacer()
                    Button(action: { showAddLocationModal = true }) {
                        HStack(spacing: 4) {
                            Image(systemName: "plus")
                            Text("Add Branch")
                        }
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Color.manaViolet)
                        .cornerRadius(12)
                    }
                }

                VStack(spacing: 12) {
                    ForEach(locations) { loc in
                        HStack(alignment: .top, spacing: 12) {
                            ZStack {
                                Circle()
                                    .fill(loc.isPrimary ? Color.green.opacity(0.12) : Color.manaViolet.opacity(0.12))
                                    .frame(width: 44, height: 44)
                                Image(systemName: loc.isPrimary ? "building.2.fill" : "mappin.circle.fill")
                                    .font(.system(size: 20))
                                    .foregroundColor(loc.isPrimary ? .green : .manaViolet)
                            }

                            VStack(alignment: .leading, spacing: 4) {
                                HStack {
                                    Text(loc.name)
                                        .font(.system(size: 14, weight: .bold))
                                        .foregroundColor(.manaTextPrimary)
                                    if loc.isPrimary {
                                        Text("PRIMARY")
                                            .font(.system(size: 9, weight: .bold))
                                            .foregroundColor(.green)
                                            .padding(.horizontal, 6)
                                            .padding(.vertical, 2)
                                            .background(Color.green.opacity(0.12))
                                            .cornerRadius(6)
                                    }
                                }
                                Text(loc.address)
                                    .font(.system(size: 12))
                                    .foregroundColor(.manaTextSecondary)
                            }
                            Spacer()
                        }
                        .padding(14)
                        .background(Color.manaSurfaceDark)
                        .cornerRadius(14)
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.manaBorder, lineWidth: 1))
                    }
                }
            }
            .padding(16)
        }
        .background(Color.manaBackground.ignoresSafeArea())
        .sheet(isPresented: $showAddLocationModal) {
            VStack(alignment: .leading, spacing: 16) {
                Capsule()
                    .fill(Color.gray.opacity(0.4))
                    .frame(width: 40, height: 5)
                    .frame(maxWidth: .infinity)
                    .padding(.top, 10)

                Text("Add New Store / Branch")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.manaTextPrimary)

                CustomFormField(label: "Branch Name", placeholder: "e.g. Tirupati West Branch", text: $newBranchName)
                CustomFormField(label: "City", placeholder: "Tirupati", text: $newBranchCity)
                CustomFormField(label: "Full Street Address", placeholder: "Door No, Area...", text: $newBranchAddress)

                Button(action: {
                    if !newBranchName.isEmpty {
                        locations.append(LocationItem(id: UUID().uuidString, name: newBranchName, city: newBranchCity, address: newBranchAddress, isPrimary: false))
                        newBranchName = ""
                        newBranchAddress = ""
                        showAddLocationModal = false
                    }
                }) {
                    Text("Add Branch Now")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color.manaViolet)
                        .cornerRadius(12)
                }

                Spacer()
            }
            .padding(16)
            .background(Color.manaBackground.ignoresSafeArea())
        }
    }
}
