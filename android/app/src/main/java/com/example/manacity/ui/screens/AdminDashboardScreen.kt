package com.example.manacity.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.example.manacity.data.Lead
import com.example.manacity.theme.*
import com.example.manacity.ui.components.ManaGlassCard
import com.example.manacity.ui.components.ManaGradientButton
import com.example.manacity.ui.components.StatusBadge

@Composable
fun AdminDashboardScreen(
    onLogout: () -> Unit,
    onNavigateToWizard: () -> Unit
) {
    var selectedTab by remember { mutableIntStateOf(0) }
    val tabs = listOf("Overview", "LMS Leads", "Marketing", "Reviews", "Referrals")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(ManaDarkBackground)
    ) {
        // Admin Header
        TopAppBar(
            title = {
                Column {
                    Text("ManaCity Business", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = ManaTextPrimary)
                    Text("Grand Spice Restaurant", fontSize = 12.sp, color = ManaSecondaryTeal)
                }
            },
            actions = {
                IconButton(onClick = onNavigateToWizard) {
                    Icon(Icons.Default.Settings, contentDescription = "Setup", tint = ManaTextSecondary)
                }
                IconButton(onClick = onLogout) {
                    Icon(Icons.Default.ExitToApp, contentDescription = "Logout", tint = Color(0xFFEF4444))
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = ManaSurfaceDark)
        )

        // Navigation Tabs
        ScrollableTabRow(
            selectedTabIndex = selectedTab,
            containerColor = ManaSurfaceDark,
            contentColor = ManaPrimaryViolet,
            edgePadding = 16.dp
        ) {
            tabs.forEachIndexed { index, title ->
                Tab(
                    selected = selectedTab == index,
                    onClick = { selectedTab = index },
                    text = { Text(title, fontSize = 13.sp, fontWeight = if (selectedTab == index) FontWeight.Bold else FontWeight.Normal) }
                )
            }
        }

        // Tab Content
        Box(modifier = Modifier.weight(1f).padding(16.dp)) {
            when (selectedTab) {
                0 -> OverviewTab()
                1 -> LmsLeadsTab()
                2 -> MarketingTab()
                3 -> ReviewManagementTab()
                4 -> UserReferralTab()
            }
        }
    }
}

@Composable
fun OverviewTab() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
            StatBox("Total Leads", "128", "+18%", ManaPrimaryViolet, Modifier.weight(1f))
            StatBox("Converted", "42", "32.8%", ManaAccentEmerald, Modifier.weight(1f))
        }
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
            StatBox("Profile Views", "3.4k", "+24%", ManaSecondaryTeal, Modifier.weight(1f))
            StatBox("Avg Rating", "4.9 ★", "142 revs", ManaAccentAmber, Modifier.weight(1f))
        }

        ManaGlassCard(modifier = Modifier.fillMaxWidth()) {
            Text("Quick Actions", color = ManaTextPrimary, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Spacer(modifier = Modifier.height(12.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(onClick = {}, colors = ButtonDefaults.buttonColors(containerColor = ManaPrimaryViolet)) {
                    Text("+ New Lead")
                }
                Button(onClick = {}, colors = ButtonDefaults.buttonColors(containerColor = ManaSurfaceCard)) {
                    Text("Connect Meta Ads")
                }
            }
        }
    }
}

@Composable
fun StatBox(title: String, value: String, change: String, color: Color, modifier: Modifier = Modifier) {
    ManaGlassCard(modifier = modifier) {
        Text(title, color = ManaTextSecondary, fontSize = 12.sp)
        Spacer(modifier = Modifier.height(4.dp))
        Text(value, color = ManaTextPrimary, fontSize = 22.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(4.dp))
        Text(change, color = color, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
    }
}

@Composable
fun LmsLeadsTab() {
    var leads by remember {
        mutableStateOf(
            listOf(
                Lead("1", "Raju Sharma", "+91 9888877777", "Meta Ads", "NEW", "Interested in catering for 50 people", "10 mins ago"),
                Lead("2", "Priya Verma", "+91 9777766666", "Website", "CONTACTED", "Asked for menu & pricing", "2 hours ago"),
                Lead("3", "Kiran Kumar", "+91 9666655555", "Google QR", "CONVERTED", "Booked table for anniversary", "Yesterday", dealAmount = 15000.0)
            )
        )
    }

    var selectedLeadForDetail by remember { mutableStateOf<Lead?>(null) }
    var showConvertToSale by remember { mutableStateOf<Lead?>(null) }

    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Text("Lead Pipeline (${leads.size})", color = ManaTextPrimary, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            StatusBadge("LMS ACTIVE")
        }

        LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(leads) { lead ->
                ManaGlassCard(onClick = { selectedLeadForDetail = lead }) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Column {
                            Text(lead.name, color = ManaTextPrimary, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Text("${lead.phone} • ${lead.source}", color = ManaTextSecondary, fontSize = 13.sp)
                            if (lead.notes.isNotEmpty()) {
                                Text(lead.notes, color = ManaTextSecondary, fontSize = 12.sp, modifier = Modifier.padding(top = 4.dp))
                            }
                        }
                        StatusBadge(lead.status)
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(horizontalArrangement = Arrangement.End, modifier = Modifier.fillMaxWidth()) {
                        TextButton(onClick = { showConvertToSale = lead }) {
                            Text("Convert to Sale", fontSize = 12.sp, color = ManaAccentEmerald)
                        }
                    }
                }
            }
        }
    }

    if (showConvertToSale != null) {
        AlertDialog(
            onDismissRequest = { showConvertToSale = null },
            title = { Text("Mark as Sale Converted") },
            text = { Text("Enter deal amount for ${showConvertToSale?.name}:") },
            confirmButton = {
                Button(onClick = { showConvertToSale = null }) { Text("Confirm Sale") }
            },
            dismissButton = {
                TextButton(onClick = { showConvertToSale = null }) { Text("Cancel") }
            }
        )
    }
}

@Composable
fun MarketingTab() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        ManaGlassCard(modifier = Modifier.fillMaxWidth()) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Share, contentDescription = null, tint = ManaPrimaryViolet, modifier = Modifier.size(32.dp))
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text("Meta Ads Integration", color = ManaTextPrimary, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text("Auto-sync leads from Facebook & Instagram Ads", color = ManaTextSecondary, fontSize = 12.sp)
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
            ManaGradientButton(text = "Connect Facebook Page", onClick = {}, modifier = Modifier.fillMaxWidth())
        }

        Text("Active Campaigns", color = ManaTextPrimary, fontWeight = FontWeight.Bold, fontSize = 16.sp)

        ManaGlassCard(modifier = Modifier.fillMaxWidth()) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Column {
                    Text("Weekend Buffet Special", color = ManaTextPrimary, fontWeight = FontWeight.Bold)
                    Text("Meta Lead Ads • ₹500/day", color = ManaTextSecondary, fontSize = 12.sp)
                }
                StatusBadge("ACTIVE")
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text("14 Leads Generated • 340 Clicks", color = ManaSecondaryTeal, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
        }
    }
}

@Composable
fun ReviewManagementTab() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        ManaGlassCard(modifier = Modifier.fillMaxWidth()) {
            Text("Review QR Poster Generator", color = ManaTextPrimary, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Text("Download printable poster for table stands & counters", color = ManaTextSecondary, fontSize = 12.sp)
            Spacer(modifier = Modifier.height(12.dp))
            Button(onClick = {}, colors = ButtonDefaults.buttonColors(containerColor = ManaSecondaryTeal)) {
                Icon(Icons.Default.Print, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Print Review QR Poster")
            }
        }
    }
}

@Composable
fun UserReferralTab() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        ManaGlassCard(modifier = Modifier.fillMaxWidth()) {
            Text("Refer & Earn Program", color = ManaTextPrimary, fontWeight = FontWeight.Bold, fontSize = 18.sp)
            Text("Earn ₹500 for every business that joins ManaCity using your link", color = ManaTextSecondary, fontSize = 13.sp)
            Spacer(modifier = Modifier.height(12.dp))
            Text("Your Referral Link:", color = ManaTextSecondary, fontSize = 11.sp)
            Text("https://manacity.in/register?ref=SPICE500", color = ManaSecondaryTeal, fontWeight = FontWeight.Bold, fontSize = 14.sp)
        }

        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
            StatBox("Total Signups", "8", "+2 this week", ManaPrimaryViolet, Modifier.weight(1f))
            StatBox("Total Earned", "₹4,000", "Paid out", ManaAccentEmerald, Modifier.weight(1f))
        }
    }
}
