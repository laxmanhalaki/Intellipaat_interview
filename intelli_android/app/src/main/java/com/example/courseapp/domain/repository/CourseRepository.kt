package com.example.courseapp.domain.repository

import com.example.courseapp.domain.model.Course
import com.example.courseapp.domain.model.Lesson
import kotlinx.coroutines.flow.Flow

interface CourseRepository {
    suspend fun getCourses(forceRefresh: Boolean = false): Result<List<Course>>
    fun observeCourses(): Flow<List<Course>>
    suspend fun getCourseById(courseId: Int): Course?
    fun observeCourseById(courseId: Int): Flow<Course?>
    fun observeLessonsForCourse(courseId: Int): Flow<List<Lesson>>
    suspend fun toggleLessonCompletion(courseId: Int, lessonId: Int): Result<Unit>
}
