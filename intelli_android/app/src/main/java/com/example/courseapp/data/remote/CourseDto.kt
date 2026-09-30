package com.example.courseapp.data.remote

data class CourseDto(
    val id: Int,
    val title: String,
    val instructor: String,
    val progress: Int,
    val lessons: Int
)

data class LessonDto(
    val id: Int,
    val courseId: Int,
    val title: String,
    val completed: Boolean
)
