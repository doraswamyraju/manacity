import SwiftUI

extension Color {
    static let manaBackground = Color(red: 248/255, green: 250/255, blue: 252/255)
    static let manaSurfaceDark = Color(red: 255/255, green: 255/255, blue: 255/255)
    static let manaSurfaceCard = Color(red: 255/255, green: 255/255, blue: 255/255)
    static let manaViolet = Color(red: 2/255, green: 132/255, blue: 199/255) // Mana Blue
    static let manaTeal = Color(red: 16/255, green: 185/255, blue: 129/255) // Emerald Green
    static let manaAmber = Color(red: 245/255, green: 158/255, blue: 11/255)
    static let manaEmerald = Color(red: 16/255, green: 185/255, blue: 129/255)
    static let manaTextPrimary = Color(red: 15/255, green: 23/255, blue: 42/255)
    static let manaTextSecondary = Color(red: 71/255, green: 85/255, blue: 105/255)
    static let manaBorder = Color(red: 226/255, green: 232/255, blue: 240/255)
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

struct ManaLogoView: View {
    enum LogoType {
        case horizontal
        case square
    }

    let type: LogoType
    var height: CGFloat = 32

    var body: some View {
        Group {
            if type == .horizontal {
                if let uiImage = UIImage(named: "LogoHorizontal") {
                    Image(uiImage: uiImage)
                        .resizable()
                        .renderingMode(.original)
                        .aspectRatio(contentMode: .fit)
                        .frame(height: height)
                } else {
                    // Fallback Branded Horizontal Logo View (100% visible on any iOS device/simulator)
                    HStack(spacing: 8) {
                        ZStack {
                            RoundedRectangle(cornerRadius: height * 0.25)
                                .fill(LinearGradient(colors: [.manaViolet, .manaTeal], startPoint: .topLeading, endPoint: .bottomTrailing))
                                .frame(width: height, height: height)
                            Text("M")
                                .font(.system(size: height * 0.55, weight: .black))
                                .foregroundColor(.white)
                        }
                        
                        Text("ManaCity")
                            .font(.system(size: height * 0.6, weight: .black))
                            .foregroundColor(.manaTextPrimary)
                    }
                }
            } else {
                if let uiImage = UIImage(named: "LogoSquare") {
                    Image(uiImage: uiImage)
                        .resizable()
                        .renderingMode(.original)
                        .aspectRatio(contentMode: .fit)
                        .frame(width: height, height: height)
                        .cornerRadius(height * 0.2)
                } else {
                    // Fallback Branded Square Logo View (100% visible on any iOS device/simulator)
                    ZStack {
                        RoundedRectangle(cornerRadius: height * 0.22)
                            .fill(LinearGradient(colors: [.manaViolet, .manaTeal], startPoint: .topLeading, endPoint: .bottomTrailing))
                            .frame(width: height, height: height)
                        
                        Text("M")
                            .font(.system(size: height * 0.5, weight: .black))
                            .foregroundColor(.white)
                    }
                }
            }
        }
    }
}
