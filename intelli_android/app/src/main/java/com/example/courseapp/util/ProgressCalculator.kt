package com.example.courseapp.util

object ProgressCalculator {
    fun calculateProgress(
        completedLessons: Int,
        totalLessons: Int
    ): Int {
        if (totalLessons <= 0 || completedLessons <= 0) {
            return 0
        }
        if (completedLessons >= totalLessons) {
            return 100
        }
        return (completedLessons * 100) / totalLessons
    }
}
