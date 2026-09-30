package com.example.courseapp.presentation.login

sealed interface LoginUiEvent {
    data class ShowToast(val message: String) : LoginUiEvent
}
