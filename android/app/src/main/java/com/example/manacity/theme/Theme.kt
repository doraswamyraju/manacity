package com.example.manacity.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val ManaDarkBackground = Color(0xFF0F172A)
val ManaSurfaceDark = Color(0xFF1E293B)
val ManaSurfaceCard = Color(0xFF334155)
val ManaPrimaryViolet = Color(0xFF6366F1)
val ManaPrimaryIndigo = Color(0xFF4F46E5)
val ManaSecondaryTeal = Color(0xFF14B8A6)
val ManaAccentAmber = Color(0xFFF59E0B)
val ManaAccentEmerald = Color(0xFF10B981)
val ManaTextPrimary = Color(0xFFF8FAFC)
val ManaTextSecondary = Color(0xFF94A3B8)
val ManaBorderGlass = Color(0xFF475569)

private val DarkColorScheme = darkColorScheme(
    primary = ManaPrimaryViolet,
    onPrimary = Color.White,
    secondary = ManaSecondaryTeal,
    onSecondary = Color.White,
    tertiary = ManaAccentAmber,
    background = ManaDarkBackground,
    onBackground = ManaTextPrimary,
    surface = ManaSurfaceDark,
    onSurface = ManaTextPrimary,
    surfaceVariant = ManaSurfaceCard,
    onSurfaceVariant = ManaTextSecondary,
    outline = ManaBorderGlass
)

@Composable
fun ManaCityTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
