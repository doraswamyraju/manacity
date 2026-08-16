import SwiftUI

struct ServicesSheetView: View {
    @Binding var searchQuery: String
    @Binding var selectedCategory: String
    let quickCategories: [(name: String, icon: String, color: Color)]
    let onClose: () -> Void

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
            }
            .padding(.horizontal, 16)

            // Reusable Active SearchBar with autoFocus = true
            SearchBarView(
                text: $searchQuery,
                placeholder: "Search all local services...",
                autoFocus: true
            )
            .padding(.horizontal, 16)

            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
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
}
