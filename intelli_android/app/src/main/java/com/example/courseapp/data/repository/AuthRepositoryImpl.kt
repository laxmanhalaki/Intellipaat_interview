package com.example.courseapp.data.repository

import com.example.courseapp.domain.repository.AuthRepository
import kotlinx.coroutines.delay
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepositoryImpl @Inject constructor() : AuthRepository {

    override suspend fun login(email: String, password: String): Result<Unit> {
        delay(1000)
        // Simulate failure if special test email is used
        if (email.contains("fail", ignoreCase = true)) {
            return Result.failure(Exception("Invalid email or password. Please check your credentials."))
        }
        return Result.success(Unit)
    }
}
