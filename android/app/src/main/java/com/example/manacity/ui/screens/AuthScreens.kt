package com.example.manacity.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.manacity.theme.*
import com.example.manacity.ui.components.ManaGlassCard
import com.example.manacity.ui.components.ManaGradientButton

@Composable
fun LoginScreen(
    onLoginSuccess: (role: String) -> Unit,
    onNavigateToRegister: () -> Unit
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var selectedRole by remember { mutableStateOf("ADMIN") }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(ManaDarkBackground)
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        ManaGlassCard(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "Welcome Back",
                color = ManaTextPrimary,
                fontSize = 26.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "Sign in to manage your ManaCity portal",
                color = ManaTextSecondary,
                fontSize = 14.sp,
                modifier = Modifier.padding(bottom = 20.dp)
            )

            // Role selection chips
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                listOf("CUSTOMER", "ADMIN", "SUPER_ADMIN").forEach { role ->
                    FilterChip(
                        selected = selectedRole == role,
                        onClick = { selectedRole = role },
                        label = { Text(role.replace("_", " "), fontSize = 11.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = ManaPrimaryViolet,
                            selectedLabelColor = Color.White,
                            containerColor = ManaSurfaceDark,
                            labelColor = ManaTextSecondary
                        )
                    )
                }
            }

            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email Address") },
                leadingIcon = { Icon(Icons.Default.Email, contentDescription = null, tint = ManaTextSecondary) },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = ManaPrimaryViolet,
                    unfocusedBorderColor = ManaBorderGlass,
                    focusedLabelColor = ManaPrimaryViolet,
                    unfocusedLabelColor = ManaTextSecondary
                ),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Password") },
                leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null, tint = ManaTextSecondary) },
                visualTransformation = PasswordVisualTransformation(),
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = ManaPrimaryViolet,
                    unfocusedBorderColor = ManaBorderGlass,
                    focusedLabelColor = ManaPrimaryViolet,
                    unfocusedLabelColor = ManaTextSecondary
                ),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(24.dp))

            ManaGradientButton(
                text = "Sign In",
                onClick = { onLoginSuccess(selectedRole) },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(16.dp))

            TextButton(
                onClick = onNavigateToRegister,
                modifier = Modifier.align(Alignment.CenterHorizontally)
            ) {
                Text(
                    text = "Don't have an account? Sign Up",
                    color = ManaSecondaryTeal,
                    fontSize = 14.sp
                )
            }
        }
    }
}

@Composable
fun RegisterScreen(
    onRegisterSuccess: (role: String) -> Unit,
    onNavigateToLogin: () -> Unit
) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var referralCode by remember { mutableStateOf("") }
    var selectedRole by remember { mutableStateOf("ADMIN") }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(ManaDarkBackground)
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        ManaGlassCard(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "Create Account",
                color = ManaTextPrimary,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "Join ManaCity local business network",
                color = ManaTextSecondary,
                fontSize = 13.sp,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Full Name") },
                leadingIcon = { Icon(Icons.Default.Person, contentDescription = null, tint = ManaTextSecondary) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email") },
                leadingIcon = { Icon(Icons.Default.Email, contentDescription = null, tint = ManaTextSecondary) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = referralCode,
                onValueChange = { referralCode = it },
                label = { Text("Referral Code (Optional)") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            ManaGradientButton(
                text = "Register Now",
                onClick = { onRegisterSuccess(selectedRole) },
                modifier = Modifier.fillMaxWidth()
            )

            TextButton(
                onClick = onNavigateToLogin,
                modifier = Modifier.align(Alignment.CenterHorizontally)
            ) {
                Text("Already have an account? Sign In", color = ManaSecondaryTeal)
            }
        }
    }
}
