package com.example.manacity.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.manacity.theme.*

@Composable
fun ManaGlassCard(
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit
) {
    val shape = RoundedCornerShape(16.dp)
    val cardModifier = if (onClick != null) {
        modifier
            .clip(shape)
            .background(ManaSurfaceCard.copy(alpha = 0.6f))
            .border(1.dp, ManaBorderGlass, shape)
            .clickable { onClick() }
            .padding(16.dp)
    } else {
        modifier
            .clip(shape)
            .background(ManaSurfaceCard.copy(alpha = 0.6f))
            .border(1.dp, ManaBorderGlass, shape)
            .padding(16.dp)
    }

    Column(modifier = cardModifier, content = content)
}

@Composable
fun ManaGradientButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    val gradient = Brush.horizontalGradient(
        colors = listOf(ManaPrimaryViolet, ManaSecondaryTeal)
    )

    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier.height(50.dp),
        colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
        contentPadding = PaddingValues(),
        shape = RoundedCornerShape(12.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(gradient)
                .padding(horizontal = 24.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = text,
                color = Color.White,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
fun RatingStars(rating: Double, reviewCount: Int? = null) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(
            imageVector = Icons.Default.Star,
            contentDescription = "Rating",
            tint = ManaAccentAmber,
            modifier = Modifier.size(18.dp)
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = String.format("%.1f", rating),
            color = ManaTextPrimary,
            fontWeight = FontWeight.Bold,
            fontSize = 14.sp
        )
        if (reviewCount != null) {
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = "($reviewCount reviews)",
                color = ManaTextSecondary,
                fontSize = 12.sp
            )
        }
    }
}

@Composable
fun StatusBadge(status: String) {
    val (bgColor, textColor) = when (status.uppercase()) {
        "NEW" -> Pair(Color(0xFF3B82F6).copy(alpha = 0.2f), Color(0xFF60A5FA))
        "CONTACTED" -> Pair(Color(0xFFF59E0B).copy(alpha = 0.2f), Color(0xFFFBBF24))
        "CONVERTED", "ACTIVE", "APPROVED" -> Pair(Color(0xFF10B981).copy(alpha = 0.2f), Color(0xFF34D399))
        "CLOSED", "PAUSED" -> Pair(Color(0xFFEF4444).copy(alpha = 0.2f), Color(0xFFF87171))
        else -> Pair(ManaSurfaceCard, ManaTextSecondary)
    }

    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(bgColor)
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(
            text = status.uppercase(),
            color = textColor,
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold
        )
    }
}
