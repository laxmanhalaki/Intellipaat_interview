package com.example.courseapp

import com.example.courseapp.domain.repository.AuthRepository
import com.example.courseapp.presentation.login.LoginUiEvent
import com.example.courseapp.presentation.login.LoginViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class LoginViewModelTest {

    private val testDispatcher = StandardTestDispatcher()

    private val fakeAuthRepository = object : AuthRepository {
        var shouldFail = false
        override suspend fun login(email: String, password: String): Result<Unit> {
            return if (shouldFail) {
                Result.failure(Exception("Invalid credentials"))
            } else {
                Result.success(Unit)
            }
        }
    }

    private lateinit var viewModel: LoginViewModel

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
        viewModel = LoginViewModel(fakeAuthRepository)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `default initial state contains prefilled demo credentials`() {
        val state = viewModel.uiState.value
        assertEquals("student@example.com", state.email)
        assertEquals("secret123", state.password)
    }

    @Test
    fun `empty email and password produces validation errors and toast`() = runTest {
        viewModel.onEmailChanged("")
        viewModel.onPasswordChanged("")
        viewModel.onLoginClicked()

        val event = viewModel.uiEvent.first()
        assertTrue(event is LoginUiEvent.ShowToast)
        assertEquals("Please enter an email address", (event as LoginUiEvent.ShowToast).message)

        val state = viewModel.uiState.value
        assertEquals("Email is required", state.emailError)
        assertEquals("Password is required", state.passwordError)
        assertEquals(false, state.isLoading)
        assertEquals(false, state.isSuccess)
    }

    @Test
    fun `invalid email format produces email error and toast event`() = runTest {
        viewModel.onEmailChanged("not-an-email")
        viewModel.onPasswordChanged("password123")
        viewModel.onLoginClicked()

        val event = viewModel.uiEvent.first()
        assertTrue(event is LoginUiEvent.ShowToast)
        assertEquals("Invalid email address. Please enter a valid email.", (event as LoginUiEvent.ShowToast).message)

        val state = viewModel.uiState.value
        assertEquals("Invalid email address", state.emailError)
        assertNull(state.passwordError)
        assertEquals(false, state.isSuccess)
    }

    @Test
    fun `email validation regex correctly checks multiple formats`() {
        assertTrue(LoginViewModel.isValidEmail("user@example.com"))
        assertTrue(LoginViewModel.isValidEmail("user.name+tag@sub.domain.co.uk"))
        assertTrue(LoginViewModel.isValidEmail("user_123@domain.org"))

        assertFalse(LoginViewModel.isValidEmail(""))
        assertFalse(LoginViewModel.isValidEmail("   "))
        assertFalse(LoginViewModel.isValidEmail("plainaddress"))
        assertFalse(LoginViewModel.isValidEmail("@missingusername.com"))
        assertFalse(LoginViewModel.isValidEmail("username@.com"))
        assertFalse(LoginViewModel.isValidEmail("username@com"))
        assertFalse(LoginViewModel.isValidEmail("username@domain..com"))
    }

    @Test
    fun `password shorter than 6 characters produces password error`() {
        viewModel.onEmailChanged("user@example.com")
        viewModel.onPasswordChanged("12345")
        viewModel.onLoginClicked()

        val state = viewModel.uiState.value
        assertNull(state.emailError)
        assertEquals("Password must be at least 6 characters", state.passwordError)
        assertEquals(false, state.isSuccess)
    }

    @Test
    fun `valid credentials triggers successful login`() = runTest {
        fakeAuthRepository.shouldFail = false
        viewModel.onEmailChanged("user@example.com")
        viewModel.onPasswordChanged("secret123")
        viewModel.onLoginClicked()

        testDispatcher.scheduler.advanceUntilIdle()

        val state = viewModel.uiState.value
        assertTrue(state.isSuccess)
        assertEquals(false, state.isLoading)
        assertNull(state.errorMessage)
    }

    @Test
    fun `auth failure displays error message`() = runTest {
        fakeAuthRepository.shouldFail = true
        viewModel.onEmailChanged("user@example.com")
        viewModel.onPasswordChanged("secret123")
        viewModel.onLoginClicked()

        testDispatcher.scheduler.advanceUntilIdle()

        val state = viewModel.uiState.value
        assertEquals(false, state.isSuccess)
        assertEquals(false, state.isLoading)
        assertNotNull(state.errorMessage)
        assertEquals("Invalid credentials", state.errorMessage)
    }
}
