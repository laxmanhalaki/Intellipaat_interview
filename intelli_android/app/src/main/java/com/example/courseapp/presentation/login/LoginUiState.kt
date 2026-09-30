package com.example.courseapp.presentation.login

data class LoginUiState(
    val email: String = "student@example.com",
    val password: String = "secret123",
    val emailError: String? = null,
    val passwordError: String? = null,
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val isSuccess: Boolean = false
)
