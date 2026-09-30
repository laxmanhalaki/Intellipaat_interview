package com.example.courseapp.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.example.courseapp.domain.model.Course

@Entity(tableName = "courses")
data class CourseEntity(
    @PrimaryKey
    val id: Int,
    val title: String,
    val instructor: String,
    val progress: Int,
    val lessons: Int
)

fun CourseEntity.toDomain(): Course {
    return Course(
        id = id,
        title = title,
        instructor = instructor,
        progress = progress,
        lessons = lessons
    )
}

fun Course.toEntity(): CourseEntity {
    return CourseEntity(
        id = id,
        title = title,
        instructor = instructor,
        progress = progress,
        lessons = lessons
    )
}
