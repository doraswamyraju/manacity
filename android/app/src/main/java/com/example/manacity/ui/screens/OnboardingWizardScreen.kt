package com.example.manacity.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
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
import com.example.manacity.ui.components.ManaGradientButton

@Composable
fun OnboardingWizardScreen(
    onComplete: () -> Unit,
    onBack: () -> Unit
) {
    var step by remember { mutableIntStateOf(1) }

    var businessName by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("Dining & Food") }
    var city by remember { mutableStateOf("Hyderabad") }
    var address by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(ManaDarkBackground)
            .padding(16.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = ManaTextPrimary)
            }
            Text("Business Onboarding Wizard", color = ManaTextPrimary, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        }

        LinearProgressIndicator(
            progress = { step / 5f },
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp),
            color = ManaPrimaryViolet,
            trackColor = ManaSurfaceCard
        )

        Text("Step $step of 5", color = ManaSecondaryTeal, fontSize = 13.sp, fontWeight = FontWeight.Bold)

        Spacer(modifier = Modifier.height(12.dp))

        ManaGlassCard(modifier = Modifier.weight(1f).fillMaxWidth()) {
            when (step) {
                1 -> StepBasicDetails(businessName, { businessName = it }, category, { category = it })
                2 -> StepLocationContact(city, { city = it }, address, { address = it }, phone, { phone = it })
                3 -> StepOperatingHours()
                4 -> StepMetaIntegration()
                5 -> StepReviewSummary(businessName, category, city, address, phone)
            }
        }

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            if (step > 1) {
                OutlinedButton(onClick = { step-- }) { Text("Previous") }
            } else {
                Spacer(modifier = Modifier.width(1.dp))
            }

            if (step < 5) {
                ManaGradientButton(text = "Next Step", onClick = { step++ })
            } else {
                ManaGradientButton(text = "Finish Setup", onClick = onComplete)
            }
        }
    }
}

@Composable
fun StepBasicDetails(name: String, onNameChange: (String) -> Unit, category: String, onCategoryChange: (String) -> Unit) {
    Column {
        Text("Basic Business Details", color = ManaTextPrimary, fontWeight = FontWeight.Bold, fontSize = 18.sp)
        Spacer(modifier = Modifier.height(16.dp))
        OutlinedTextField(
            value = name,
            onValueChange = onNameChange,
            label = { Text("Business Name") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(12.dp))
        OutlinedTextField(
            value = category,
            onValueChange = onCategoryChange,
            label = { Text("Primary Category") },
            modifier = Modifier.fillMaxWidth()
        )
    }
}

@Composable
fun StepLocationContact(city: String, onCityChange: (String) -> Unit, address: String, onAddressChange: (String) -> Unit, phone: String, onPhoneChange: (String) -> Unit) {
    Column {
        Text("Location & Contact", color = ManaTextPrimary, fontWeight = FontWeight.Bold, fontSize = 18.sp)
        Spacer(modifier = Modifier.height(16.dp))
        OutlinedTextField(value = city, onValueChange = onCityChange, label = { Text("City") }, modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(value = address, onValueChange = onAddressChange, label = { Text("Full Address") }, modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(value = phone, onValueChange = onPhoneChange, label = { Text("Business Phone") }, modifier = Modifier.fillMaxWidth())
    }
}

@Composable
fun StepOperatingHours() {
    Column {
        Text("Operating Hours & Days", color = ManaTextPrimary, fontWeight = FontWeight.Bold, fontSize = 18.sp)
        Text("Select business opening & closing times", color = ManaTextSecondary, fontSize = 13.sp)
        Spacer(modifier = Modifier.height(16.dp))
        Text("Monday - Saturday: 09:00 AM - 10:00 PM", color = ManaTextPrimary)
        Text("Sunday: Closed", color = ManaTextSecondary)
    }
}

@Composable
fun StepMetaIntegration() {
    Column {
        Text("Meta Lead Ads Connection", color = ManaTextPrimary, fontWeight = FontWeight.Bold, fontSize = 18.sp)
        Text("Connect your Facebook/Instagram page to auto-capture leads in LMS", color = ManaTextSecondary, fontSize = 13.sp)
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = {}, colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1877F2))) {
            Text("Connect Meta Account")
        }
    }
}

@Composable
fun StepReviewSummary(name: String, category: String, city: String, address: String, phone: String) {
    Column {
        Text("Review Your Business Profile", color = ManaTextPrimary, fontWeight = FontWeight.Bold, fontSize = 18.sp)
        Spacer(modifier = Modifier.height(16.dp))
        Text("Name: $name", color = ManaTextPrimary)
        Text("Category: $category", color = ManaTextSecondary)
        Text("City: $city", color = ManaTextSecondary)
        Text("Address: $address", color = ManaTextSecondary)
        Text("Phone: $phone", color = ManaTextSecondary)
    }
}
