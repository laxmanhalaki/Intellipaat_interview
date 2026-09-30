package com.example.courseapp.data.remote

interface CourseApi {
    suspend fun getCourses(): List<CourseDto>
    suspend fun getLessonsForCourse(courseId: Int): List<LessonDto>
}
