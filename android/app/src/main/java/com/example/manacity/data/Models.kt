package com.example.manacity.data

import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: String = "",
    val name: String = "",
    val email: String = "",
    val role: String = "CUSTOMER", // CUSTOMER, ADMIN, SUPER_ADMIN
    val phone: String? = null,
    val isVerified: Boolean = false
)

@Serializable
data class AuthResponse(
    val status: String = "success",
    val token: String? = null,
    val user: User? = null,
    val message: String? = null
)

@Serializable
data class Business(
    val id: String = "",
    val name: String = "",
    val slug: String = "",
    val category: String = "General",
    val city: String = "Hyderabad",
    val address: String = "",
    val phone: String = "",
    val rating: Double = 4.8,
    val reviewCount: Int = 12,
    val imageUrl: String? = null,
    val isVerified: Boolean = true,
    val isClaimed: Boolean = true,
    val description: String = ""
)

@Serializable
data class Lead(
    val id: String = "",
    val name: String = "",
    val phone: String = "",
    val source: String = "Website",
    val status: String = "NEW", // NEW, CONTACTED, IN_PROGRESS, CONVERTED, CLOSED
    val notes: String = "",
    val createdAt: String = "",
    val reminderDate: String? = null,
    val dealAmount: Double? = null
)

@Serializable
data class ReferralStats(
    val referralCode: String = "",
    val totalClicks: Int = 0,
    val totalSignups: Int = 0,
    val pendingPayouts: Double = 0.0,
    val totalEarned: Double = 0.0,
    val bankDetailsConfigured: Boolean = false
)

@Serializable
data class Review(
    val id: String = "",
    val userName: String = "",
    val rating: Int = 5,
    val comment: String = "",
    val createdAt: String = "",
    val reply: String? = null,
    val status: String = "APPROVED"
)

@Serializable
data class Campaign(
    val id: String = "",
    val name: String = "",
    val platform: String = "Meta Ads",
    val budget: Double = 500.0,
    val status: String = "ACTIVE", // ACTIVE, PAUSED, ENDED
    val leadsGenerated: Int = 14,
    val clicks: Int = 340
)
