package com.example.manacity.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
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
import com.example.manacity.data.Business
import com.example.manacity.theme.*
import com.example.manacity.ui.components.ManaGlassCard
import com.example.manacity.ui.components.ManaGradientButton
import com.example.manacity.ui.components.RatingStars
import com.example.manacity.ui.components.StatusBadge

@Composable
fun PublicHomeScreen(
    onSelectBusiness: (Business) -> Unit,
    onNavigateToLogin: () -> Unit,
    onNavigateToRegister: () -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedCity by remember { mutableStateOf("Hyderabad") }
    var selectedCategory by remember { mutableStateOf("All") }
    var showClaimModal by remember { mutableStateOf(false) }

    val mockBusinesses = remember {
        listOf(
            Business("1", "Grand Spice Restaurant", "grand-spice", "Dining & Food", "Hyderabad", "Banjara Hills, Hyd", "+91 9876543210", 4.9, 142, description = "Authentic Biryani & Fine Dining"),
            Business("2", "Apex Dental Clinic", "apex-dental", "Healthcare", "Hyderabad", "Jubilee Hills, Hyd", "+91 9123456789", 4.8, 89, description = "Modern Dental Care & Orthodontics"),
            Business("3", "Royal Fitness Gym", "royal-fitness", "Fitness", "Bengaluru", "Indiranagar, Blr", "+91 9988776655", 4.7, 56, description = "24/7 Gym with Personal Trainers"),
            Business("4", "TechRepair Solutions", "tech-repair", "Services", "Hyderabad", "Gachibowli, Hyd", "+91 9554433221", 4.6, 34, description = "Laptop & Smartphone Repair Center")
        )
    }

    val categories = listOf("All", "Dining & Food", "Healthcare", "Fitness", "Services", "Shopping")
    val cities = listOf("Hyderabad", "Bengaluru", "Mumbai", "Chennai", "Delhi")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(ManaDarkBackground)
            .padding(16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("ManaCity", color = ManaPrimaryViolet, fontSize = 24.sp, fontWeight = FontWeight.ExtraBold)
                Text("Discover Local Verified Businesses", color = ManaTextSecondary, fontSize = 12.sp)
            }
            Row {
                IconButton(onClick = onNavigateToLogin) {
                    Icon(Icons.Default.AccountCircle, contentDescription = "Login", tint = ManaSecondaryTeal)
                }
            }
        }

        // Search Bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Search places, services, doctors...") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = ManaTextSecondary) },
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            shape = RoundedCornerShape(14.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = ManaPrimaryViolet,
                unfocusedBorderColor = ManaBorderGlass,
                containerColor = ManaSurfaceDark
            )
        )

        // City Selector
        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(vertical = 6.dp)) {
            items(cities) { city ->
                FilterChip(
                    selected = selectedCity == city,
                    onClick = { selectedCity = city },
                    label = { Text(city, fontSize = 12.sp) },
                    leadingIcon = { Icon(Icons.Default.LocationOn, contentDescription = null, modifier = Modifier.size(14.dp)) }
                )
            }
        }

        // Category Filter
        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(bottom = 12.dp)) {
            items(categories) { category ->
                FilterChip(
                    selected = selectedCategory == category,
                    onClick = { selectedCategory = category },
                    label = { Text(category, fontSize = 12.sp) }
                )
            }
        }

        // Business List
        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(mockBusinesses) { biz ->
                ManaGlassCard(onClick = { onSelectBusiness(biz) }) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Top
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(biz.name, color = ManaTextPrimary, fontWeight = FontWeight.Bold, fontSize = 17.sp)
                                Spacer(modifier = Modifier.width(6.dp))
                                if (biz.isVerified) {
                                    Icon(Icons.Default.CheckCircle, contentDescription = "Verified", tint = ManaSecondaryTeal, modifier = Modifier.size(16.dp))
                                }
                            }
                            Text(biz.description, color = ManaTextSecondary, fontSize = 13.sp, modifier = Modifier.padding(vertical = 2.dp))
                            Text(biz.address, color = ManaTextSecondary, fontSize = 12.sp)
                            Spacer(modifier = Modifier.height(6.dp))
                            RatingStars(rating = biz.rating, reviewCount = biz.reviewCount)
                        }

                        Button(
                            onClick = { showClaimModal = true },
                            colors = ButtonDefaults.buttonColors(containerColor = ManaSurfaceCard),
                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Claim", fontSize = 11.sp, color = ManaAccentAmber)
                        }
                    }
                }
            }
        }
    }

    if (showClaimModal) {
        AlertDialog(
            onDismissRequest = { showClaimModal = false },
            title = { Text("Claim Business Profile") },
            text = { Text("Are you the owner of this business? Submit your claim request to get access to ManaCity Admin Dashboard.") },
            confirmButton = {
                Button(onClick = { showClaimModal = false }) {
                    Text("Submit Claim Request")
                }
            },
            dismissButton = {
                TextButton(onClick = { showClaimModal = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}
