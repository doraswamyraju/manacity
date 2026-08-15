import SwiftUI

extension Color {
    static let manaBackground = Color(red: 15/255, green: 23/255, blue: 42/255)
    static let manaSurfaceDark = Color(red: 30/255, green: 41/255, blue: 59/255)
    static let manaSurfaceCard = Color(red: 51/255, green: 65/255, blue: 85/255)
    static let manaViolet = Color(red: 99/255, green: 102/255, blue: 241/255)
    static let manaTeal = Color(red: 20/255, green: 184/255, blue: 166/255)
    static let manaAmber = Color(red: 245/255, green: 158/255, blue: 11/255)
    static let manaEmerald = Color(red: 16/255, green: 185/255, blue: 129/255)
    static let manaTextPrimary = Color(red: 248/255, green: 250/255, blue: 252/255)
    static let manaTextSecondary = Color(red: 148/255, green: 163/255, blue: 184/255)
    static let manaBorder = Color(red: 71/255, green: 85/255, blue: 105/255)
}


struct ManaGlassCardModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(16)
            .background(Color.manaSurfaceCard.opacity(0.6))
            .cornerRadius(16)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(Color.manaBorder, lineWidth: 1)
            )
    }
}

extension View {
    func manaGlassCard() -> some View {
        self.modifier(ManaGlassCardModifier())
    }
}

struct ManaGradientButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 50)
                .background(
                    LinearGradient(
                        colors: [.manaViolet, .manaTeal],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(12)
        }
    }
}

struct StatusBadge: View {
    let status: String

    var colorTuple: (Color, Color) {
        switch status.uppercased() {
        case "NEW": return (Color.blue.opacity(0.2), Color.blue)
        case "CONTACTED": return (Color.manaAmber.opacity(0.2), Color.manaAmber)
        case "CONVERTED", "ACTIVE", "APPROVED": return (Color.manaEmerald.opacity(0.2), Color.manaEmerald)
        case "CLOSED": return (Color.red.opacity(0.2), Color.red)
        default: return (Color.manaSurfaceCard, Color.manaTextSecondary)
        }
    }

    var body: some View {
        Text(status.uppercased())
            .font(.system(size: 11, weight: .bold))
            .foregroundColor(colorTuple.1)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(colorTuple.0)
            .cornerRadius(8)
    }
}
