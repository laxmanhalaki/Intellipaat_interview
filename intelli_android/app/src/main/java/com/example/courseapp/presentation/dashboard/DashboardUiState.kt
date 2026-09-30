package com.example.courseapp.presentation.dashboard

import com.example.courseapp.domain.model.Course

sealed interface DashboardUiState {
    data object Loading : DashboardUiState
    data class Success(
        val courses: List<Course>,
        val isOffline: Boolean = false
    ) : DashboardUiState
    data object Empty : DashboardUiState
    data class Error(val message: String) : DashboardUiState
}
