package com.example.manacity.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.VerifiedUser
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
fun SuperAdminScreen(onLogout: () -> Unit) {
    var selectedTab by remember { mutableIntStateOf(0) }
    val tabs = listOf("Pending Claims", "All Businesses", "Referral Payouts", "System Health")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(ManaDarkBackground)
    ) {
        TopAppBar(
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.VerifiedUser, contentDescription = null, tint = ManaAccentAmber)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Super Admin Console", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = ManaTextPrimary)
                }
            },
            actions = {
                IconButton(onClick = onLogout) {
                    Icon(Icons.Default.ExitToApp, contentDescription = "Logout", tint = Color(0xFFEF4444))
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = ManaSurfaceDark)
        )

        ScrollableTabRow(selectedTabIndex = selectedTab, containerColor = ManaSurfaceDark) {
            tabs.forEachIndexed { index, title ->
                Tab(
                    selected = selectedTab == index,
                    onClick = { selectedTab = index },
                    text = { Text(title, fontSize = 12.sp) }
                )
            }
        }

        Box(modifier = Modifier.weight(1f).padding(16.dp)) {
            when (selectedTab) {
                0 -> PendingClaimsTab()
                1 -> SuperAdminBusinessesTab()
                2 -> SuperAdminPayoutsTab()
                3 -> SystemHealthTab()
            }
        }
    }
}

@Composable
fun PendingClaimsTab() {
    val pendingClaims = remember {
        listOf(
            Triple("Grand Spice Restaurant", "Raju Sharma", "Proof: GST Invoice attached"),
            Triple("Apex Dental Clinic", "Dr. A. Rao", "Proof: Medical License attached")
        )
    }

    LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        items(pendingClaims) { (biz, claimant, proof) ->
            ManaGlassCard(modifier = Modifier.fillMaxWidth()) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Column {
                        Text(biz, color = ManaTextPrimary, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text("Claimant: $claimant", color = ManaTextSecondary, fontSize = 13.sp)
                        Text(proof, color = ManaSecondaryTeal, fontSize = 12.sp)
                    }
                    StatusBadge("PENDING")
                }
                Spacer(modifier = Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(onClick = {}, colors = ButtonDefaults.buttonColors(containerColor = ManaAccentEmerald)) {
                        Text("Approve Claim")
                    }
                    OutlinedButton(onClick = {}) {
                        Text("Reject", color = Color(0xFFEF4444))
                    }
                }
            }
        }
    }
}

@Composable
fun SuperAdminBusinessesTab() {
    Text("Registered Businesses (48)", color = ManaTextPrimary, fontWeight = FontWeight.Bold)
}

@Composable
fun SuperAdminPayoutsTab() {
    Text("Pending Referral Payout Requests (₹12,500)", color = ManaTextPrimary, fontWeight = FontWeight.Bold)
}

@Composable
fun SystemHealthTab() {
    Column {
        Text("Backend Server: Online (99.9% Uptime)", color = ManaAccentEmerald, fontWeight = FontWeight.Bold)
        Text("Database: PostgreSQL Connected", color = ManaTextSecondary)
    }
}
