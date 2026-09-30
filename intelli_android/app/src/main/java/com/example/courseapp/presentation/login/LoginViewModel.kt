package com.example.courseapp.presentation.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.courseapp.domain.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    private val _uiEvent = Channel<LoginUiEvent>(Channel.BUFFERED)
    val uiEvent: Flow<LoginUiEvent> = _uiEvent.receiveAsFlow()

    companion object {
        val EMAIL_REGEX = Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9]+([.-][A-Za-z0-9]+)*\\.[A-Za-z]{2,}$")

        fun isValidEmail(email: String): Boolean {
            return email.isNotBlank() && EMAIL_REGEX.matches(email.trim())
        }
    }

    fun onEmailChanged(newEmail: String) {
        _uiState.update {
            it.copy(
                email = newEmail,
                emailError = null,
                errorMessage = null
            )
        }
    }

    fun onPasswordChanged(newPassword: String) {
        _uiState.update {
            it.copy(
                password = newPassword,
                passwordError = null,
                errorMessage = null
            )
        }
    }

    fun onLoginClicked() {
        val currentState = _uiState.value
        val email = currentState.email.trim()
        val password = currentState.password

        var hasError = false
        var emailError: String? = null
        var passwordError: String? = null

        if (email.isBlank()) {
            emailError = "Email is required"
            hasError = true
            viewModelScope.launch {
                _uiEvent.send(LoginUiEvent.ShowToast("Please enter an email address"))
            }
        } else if (!isValidEmail(email)) {
            emailError = "Invalid email address"
            hasError = true
            viewModelScope.launch {
                _uiEvent.send(LoginUiEvent.ShowToast("Invalid email address. Please enter a valid email."))
            }
        }

        if (password.isBlank()) {
            passwordError = "Password is required"
            hasError = true
        } else if (password.length < 6) {
            passwordError = "Password must be at least 6 characters"
            hasError = true
        }

        if (hasError) {
            _uiState.update {
                it.copy(
                    emailError = emailError,
                    passwordError = passwordError
                )
            }
            return
        }

        _uiState.update { it.copy(isLoading = true, errorMessage = null) }

        viewModelScope.launch {
            val result = authRepository.login(email, password)
            result.onSuccess {
                _uiState.update { it.copy(isLoading = false, isSuccess = true) }
            }.onFailure { error ->
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = error.message ?: "Authentication failed. Please try again."
                    )
                }
            }
        }
    }
}
