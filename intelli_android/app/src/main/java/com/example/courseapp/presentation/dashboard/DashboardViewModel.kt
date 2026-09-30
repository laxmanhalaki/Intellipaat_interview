package com.example.courseapp.presentation.dashboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.courseapp.domain.repository.CourseRepository
import com.example.courseapp.util.ConnectivityObserver
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val courseRepository: CourseRepository,
    private val connectivityObserver: ConnectivityObserver
) : ViewModel() {

    private val _uiState = MutableStateFlow<DashboardUiState>(DashboardUiState.Loading)
    val uiState: StateFlow<DashboardUiState> = _uiState.asStateFlow()

    val isOnline: StateFlow<Boolean> = connectivityObserver.isConnected
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = connectivityObserver.isCurrentlyConnected()
        )

    init {
        // Observe reactive updates from Room so progress updates reflect instantly
        viewModelScope.launch {
            courseRepository.observeCourses().collect { courses ->
                val current = _uiState.value
                if (current is DashboardUiState.Success && courses.isNotEmpty()) {
                    _uiState.value = current.copy(courses = courses)
                }
            }
        }

        // Auto-refresh when device reconnects to internet
        viewModelScope.launch {
            var wasConnected = connectivityObserver.isCurrentlyConnected()
            connectivityObserver.isConnected.collect { connected ->
                if (connected && !wasConnected) {
                    loadCourses()
                }
                wasConnected = connected
            }
        }

        loadCourses()
    }

    fun loadCourses() {
        _uiState.value = DashboardUiState.Loading
        viewModelScope.launch {
            val result = courseRepository.getCourses()
            val online = connectivityObserver.isCurrentlyConnected()
            result.onSuccess { courses ->
                if (courses.isEmpty()) {
                    _uiState.value = DashboardUiState.Empty
                } else {
                    _uiState.value = DashboardUiState.Success(
                        courses = courses,
                        isOffline = !online
                    )
                }
            }.onFailure { error ->
                _uiState.value = DashboardUiState.Error(
                    message = error.message ?: "Unable to load courses. Please try again."
                )
            }
        }
    }
}
