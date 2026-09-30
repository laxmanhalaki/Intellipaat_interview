package com.example.courseapp

import com.example.courseapp.util.ProgressCalculator
import org.junit.Assert.assertEquals
import org.junit.Test

class ProgressCalculatorTest {

    @Test
    fun `calculates progress correctly for typical values`() {
        val result = ProgressCalculator.calculateProgress(
            completedLessons = 2,
            totalLessons = 4
        )
        assertEquals(50, result)
    }

    @Test
    fun `calculates zero progress when no lessons completed`() {
        val result = ProgressCalculator.calculateProgress(
            completedLessons = 0,
            totalLessons = 4
        )
        assertEquals(0, result)
    }

    @Test
    fun `calculates one fourth progress correctly`() {
        val result = ProgressCalculator.calculateProgress(
            completedLessons = 1,
            totalLessons = 4
        )
        assertEquals(25, result)
    }

    @Test
    fun `calculates three fourths progress correctly`() {
        val result = ProgressCalculator.calculateProgress(
            completedLessons = 3,
            totalLessons = 4
        )
        assertEquals(75, result)
    }

    @Test
    fun `calculates complete progress when all lessons completed`() {
        val result = ProgressCalculator.calculateProgress(
            completedLessons = 4,
            totalLessons = 4
        )
        assertEquals(100, result)
    }

    @Test
    fun `returns zero when total lessons is zero`() {
        val result = ProgressCalculator.calculateProgress(
            completedLessons = 0,
            totalLessons = 0
        )
        assertEquals(0, result)
    }

    @Test
    fun `caps at 100 when completed exceeds total lessons`() {
        val result = ProgressCalculator.calculateProgress(
            completedLessons = 5,
            totalLessons = 4
        )
        assertEquals(100, result)
    }

    @Test
    fun `returns zero for negative completed lessons`() {
        val result = ProgressCalculator.calculateProgress(
            completedLessons = -1,
            totalLessons = 4
        )
        assertEquals(0, result)
    }
}
