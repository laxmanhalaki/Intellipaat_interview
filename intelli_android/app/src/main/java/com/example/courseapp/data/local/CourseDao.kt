package com.example.courseapp.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface CourseDao {

    @Query("SELECT * FROM courses ORDER BY id ASC")
    fun observeAllCourses(): Flow<List<CourseEntity>>

    @Query("SELECT * FROM courses ORDER BY id ASC")
    suspend fun getAllCourses(): List<CourseEntity>

    @Query("SELECT * FROM courses WHERE id = :courseId")
    suspend fun getCourseById(courseId: Int): CourseEntity?

    @Query("SELECT * FROM courses WHERE id = :courseId")
    fun observeCourseById(courseId: Int): Flow<CourseEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCourses(courses: List<CourseEntity>)

    @Query("UPDATE courses SET progress = :progress WHERE id = :courseId")
    suspend fun updateCourseProgress(courseId: Int, progress: Int)

    @Query("SELECT * FROM lessons WHERE courseId = :courseId ORDER BY id ASC")
    fun observeLessonsForCourse(courseId: Int): Flow<List<LessonEntity>>

    @Query("SELECT * FROM lessons WHERE courseId = :courseId ORDER BY id ASC")
    suspend fun getLessonsForCourse(courseId: Int): List<LessonEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLessons(lessons: List<LessonEntity>)

    @Query("UPDATE lessons SET completed = :completed WHERE id = :lessonId")
    suspend fun updateLessonCompletion(lessonId: Int, completed: Boolean)
}
