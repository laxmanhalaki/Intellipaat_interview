package com.example.courseapp.data.remote

import kotlinx.coroutines.delay
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MockCourseApi @Inject constructor() : CourseApi {

    var simulateError: Boolean = false
    var simulateEmpty: Boolean = false

    override suspend fun getCourses(): List<CourseDto> {
        delay(800)
        if (simulateError) {
            throw IOException("Network error: Unable to reach courses server.")
        }
        if (simulateEmpty) {
            return emptyList()
        }
        return listOf(
            CourseDto(
                id = 1,
                title = "Python Programming",
                instructor = "John Smith",
                progress = 50,
                lessons = 4
            ),
            CourseDto(
                id = 2,
                title = "Generative AI",
                instructor = "Sarah Williams",
                progress = 25,
                lessons = 4
            ),
            CourseDto(
                id = 3,
                title = "Full Stack Development",
                instructor = "David Brown",
                progress = 25,
                lessons = 4
            )
        )
    }

    override suspend fun getLessonsForCourse(courseId: Int): List<LessonDto> {
        delay(400)
        if (simulateError) {
            throw IOException("Network error: Unable to fetch lessons.")
        }
        return when (courseId) {
            1 -> listOf(
                LessonDto(101, 1, "Introduction to Python", true),
                LessonDto(102, 1, "Variables & Data Types", true),
                LessonDto(103, 1, "Functions & Modular Code", false),
                LessonDto(104, 1, "Object-Oriented Programming", false)
            )
            2 -> listOf(
                LessonDto(201, 2, "Introduction to LLMs", true),
                LessonDto(202, 2, "Prompt Engineering & Few-shot", false),
                LessonDto(203, 2, "Embeddings & Vector Databases", false),
                LessonDto(204, 2, "Fine-tuning & Evaluation", false)
            )
            3 -> listOf(
                LessonDto(301, 3, "Frontend Fundamentals (HTML/CSS)", true),
                LessonDto(302, 3, "Modern JavaScript & TypeScript", false),
                LessonDto(303, 3, "Backend APIs & Database Design", false),
                LessonDto(304, 3, "Cloud Deployment & CI/CD", false)
            )
            else -> emptyList()
        }
    }
}
