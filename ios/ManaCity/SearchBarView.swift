import SwiftUI

struct SearchBarView: View {
    @Binding var text: String
    var placeholder: String = "Search restaurants, doctors, services..."
    var autoFocus: Bool = false

    @FocusState private var isFocused: Bool

    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 15, weight: .bold))
                .foregroundColor(.manaViolet)

            TextField(placeholder, text: $text)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(.manaTextPrimary)
                .accentColor(.manaViolet)
                .focused($isFocused)

            if !text.isEmpty {
                Button(action: { text = "" }) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 16))
                        .foregroundColor(.manaTextSecondary)
                }
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 12)
        .background(Color.manaSurfaceDark)
        .cornerRadius(14)
        .overlay(RoundedRectangle(cornerRadius: 14).stroke(isFocused ? Color.manaViolet : Color.manaBorder, lineWidth: 1.5))
        .onAppear {
            if autoFocus {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                    self.isFocused = true
                }
            }
        }
    }
}
