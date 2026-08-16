import SwiftUI

struct User: Codable, Identifiable {
    var id: String = ""
    var name: String = ""
    var email: String = ""
    var role: String = "CUSTOMER"
    var phone: String? = nil
    var isVerified: Bool = false
}

struct Business: Codable, Identifiable {
    var id: String = UUID().uuidString
    var name: String
    var slug: String
    var category: String
    var city: String
    var address: String
    var phone: String
    var rating: Double
    var reviewCount: Int
    var isVerified: Bool = true
    var isClaimed: Bool = true
    var description: String
    var logoUrl: String? = nil
    var coverImage: String? = nil
}

struct Lead: Codable, Identifiable {
    var id: String = UUID().uuidString
    var name: String
    var phone: String
    var source: String
    var status: String // NEW, CONTACTED, IN_PROGRESS, CONVERTED, CLOSED
    var notes: String
    var createdAt: String
    var dealAmount: Double? = nil
}

struct Campaign: Codable, Identifiable {
    var id: String = UUID().uuidString
    var name: String
    var platform: String = "Meta Ads"
    var budget: Double = 500.0
    var status: String = "ACTIVE"
    var leadsGenerated: Int = 14
    var clicks: Int = 340
}

func fullImageUrl(_ path: String?) -> URL? {
    guard let path = path, !path.trimmingCharacters(in: .whitespaces).isEmpty else { return nil }
    if path.hasPrefix("http://") || path.hasPrefix("https://") {
        return URL(string: path)
    }
    let formattedPath = path.hasPrefix("/") ? path : "/\(path)"
    return URL(string: "https://manacity.in\(formattedPath)")
}
