package com.example.manacity.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.manacity.theme.*
import com.example.manacity.ui.components.ManaGlassCard
import com.example.manacity.ui.components.StatusBadge

@Composable
fun CustomerDashboardScreen(onLogout: () -> Unit) {
    var selectedTab by remember { mutableIntStateOf(0) }
    val tabs = listOf("My Enquiries", "My Reviews", "Saved Places", "Referrals & Rewards")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(ManaDarkBackground)
    ) {
        TopAppBar(
            title = {
                Column {
                    Text("My ManaCity Account", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = ManaTextPrimary)
                    Text("Customer Dashboard", fontSize = 12.sp, color = ManaSecondaryTeal)
                }
            },
            actions = {
                IconButton(onClick = onLogout) {
                    Icon(Icons.Default.ExitToApp, contentDescription = "Logout", tint = Color(0xFFEF4444))
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = ManaSurfaceDark)
        )

        TabRow(selectedTabIndex = selectedTab, containerColor = ManaSurfaceDark) {
            tabs.forEachIndexed { index, title ->
                Tab(
                    selected = selectedTab == index,
                    onClick = { selectedTab = index },
                    text = { Text(title, fontSize = 11.sp) }
                )
            }
        }

        Box(modifier = Modifier.weight(1f).padding(16.dp)) {
            when (selectedTab) {
                0 -> CustomerEnquiriesTab()
                1 -> CustomerReviewsTab()
                2 -> CustomerSavedPlacesTab()
                3 -> UserReferralTab()
            }
        }
    }
}

@Composable
fun CustomerEnquiriesTab() {
    val mockEnquiries = remember {
        listOf(
            Triple("Grand Spice Restaurant", "Table booking enquiry for 4 guests", "CONTACTED"),
            Triple("Apex Dental Clinic", "Appointment request for teeth cleaning", "NEW")
        )
    }

    LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        items(mockEnquiries) { (bizName, details, status) ->
            ManaGlassCard(modifier = Modifier.fillMaxWidth()) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Column {
                        Text(bizName, color = ManaTextPrimary, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text(details, color = ManaTextSecondary, fontSize = 13.sp)
                    }
                    StatusBadge(status)
                }
            }
        }
    }
}

@Composable
fun CustomerReviewsTab() {
    LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        items(listOf("Grand Spice Restaurant" to "5 ★ - Outstanding Biryani and great hospitality!")) { (biz, rev) ->
            ManaGlassCard(modifier = Modifier.fillMaxWidth()) {
                Text(biz, color = ManaTextPrimary, fontWeight = FontWeight.Bold)
                Text(rev, color = ManaTextSecondary, fontSize = 13.sp)
            }
        }
    }
}

@Composable
fun CustomerSavedPlacesTab() {
    LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        items(listOf("Apex Dental Clinic", "Royal Fitness Gym")) { place ->
            ManaGlassCard(modifier = Modifier.fillMaxWidth()) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Bookmark, contentDescription = null, tint = ManaAccentAmber)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(place, color = ManaTextPrimary, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
