package com.example.courseapp.domain.model

data class Lesson(
    val id: Int,
    val courseId: Int,
    val title: String,
    val completed: Boolean
)
