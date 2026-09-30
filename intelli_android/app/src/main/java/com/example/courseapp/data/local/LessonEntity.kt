package com.example.courseapp.data.local

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey
import com.example.courseapp.domain.model.Lesson

@Entity(
    tableName = "lessons",
    foreignKeys = [
        ForeignKey(
            entity = CourseEntity::class,
            parentColumns = ["id"],
            childColumns = ["courseId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index(value = ["courseId"])]
)
data class LessonEntity(
    @PrimaryKey
    val id: Int,
    val courseId: Int,
    val title: String,
    val completed: Boolean
)

fun LessonEntity.toDomain(): Lesson {
    return Lesson(
        id = id,
        courseId = courseId,
        title = title,
        completed = completed
    )
}

fun Lesson.toEntity(): LessonEntity {
    return LessonEntity(
        id = id,
        courseId = courseId,
        title = title,
        completed = completed
    )
}
