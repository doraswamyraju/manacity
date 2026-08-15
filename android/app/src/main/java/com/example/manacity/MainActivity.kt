package com.example.manacity

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.Crossfade
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.example.manacity.data.Business
import com.example.manacity.theme.ManaDarkBackground
import com.example.manacity.theme.ManaCityTheme
import com.example.manacity.ui.screens.*

sealed interface AppScreen {
    object PublicHome : AppScreen
    object Login : AppScreen
    object Register : AppScreen
    object AdminDashboard : AppScreen
    object CustomerDashboard : AppScreen
    object SuperAdminConsole : AppScreen
    object OnboardingWizard : AppScreen
    data class BusinessDetail(val business: Business) : AppScreen
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ManaCityTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = ManaDarkBackground
                ) {
                    var currentScreen by remember { mutableStateOf<AppScreen>(AppScreen.PublicHome) }

                    Crossfade(targetState = currentScreen, label = "ScreenTransition") { screen ->
                        when (screen) {
                            is AppScreen.PublicHome -> PublicHomeScreen(
                                onSelectBusiness = { currentScreen = AppScreen.BusinessDetail(it) },
                                onNavigateToLogin = { currentScreen = AppScreen.Login },
                                onNavigateToRegister = { currentScreen = AppScreen.Register }
                            )

                            is AppScreen.Login -> LoginScreen(
                                onLoginSuccess = { role ->
                                    currentScreen = when (role.uppercase()) {
                                        "SUPER_ADMIN" -> AppScreen.SuperAdminConsole
                                        "CUSTOMER" -> AppScreen.CustomerDashboard
                                        else -> AppScreen.AdminDashboard
                                    }
                                },
                                onNavigateToRegister = { currentScreen = AppScreen.Register }
                            )

                            is AppScreen.Register -> RegisterScreen(
                                onRegisterSuccess = { role ->
                                    currentScreen = when (role.uppercase()) {
                                        "SUPER_ADMIN" -> AppScreen.SuperAdminConsole
                                        "CUSTOMER" -> AppScreen.CustomerDashboard
                                        else -> AppScreen.OnboardingWizard
                                    }
                                },
                                onNavigateToLogin = { currentScreen = AppScreen.Login }
                            )

                            is AppScreen.AdminDashboard -> AdminDashboardScreen(
                                onLogout = { currentScreen = AppScreen.PublicHome },
                                onNavigateToWizard = { currentScreen = AppScreen.OnboardingWizard }
                            )

                            is AppScreen.CustomerDashboard -> CustomerDashboardScreen(
                                onLogout = { currentScreen = AppScreen.PublicHome }
                            )

                            is AppScreen.SuperAdminConsole -> SuperAdminScreen(
                                onLogout = { currentScreen = AppScreen.PublicHome }
                            )

                            is AppScreen.OnboardingWizard -> OnboardingWizardScreen(
                                onComplete = { currentScreen = AppScreen.AdminDashboard },
                                onBack = { currentScreen = AppScreen.AdminDashboard }
                            )

                            is AppScreen.BusinessDetail -> PublicHomeScreen(
                                onSelectBusiness = {},
                                onNavigateToLogin = { currentScreen = AppScreen.Login },
                                onNavigateToRegister = { currentScreen = AppScreen.Register }
                            )
                        }
                    }
                }
            }
        }
    }
}
