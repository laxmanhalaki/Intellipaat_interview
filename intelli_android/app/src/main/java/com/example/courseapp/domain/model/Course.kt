package com.example.courseapp.domain.model

data class Course(
    val id: Int,
    val title: String,
    val instructor: String,
    val progress: Int,
    val lessons: Int
)
