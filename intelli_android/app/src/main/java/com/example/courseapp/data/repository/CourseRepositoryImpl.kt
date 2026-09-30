package com.example.courseapp.data.repository

import com.example.courseapp.data.local.CourseDao
import com.example.courseapp.data.local.CourseEntity
import com.example.courseapp.data.local.LessonEntity
import com.example.courseapp.data.local.toDomain
import com.example.courseapp.data.local.toEntity
import com.example.courseapp.data.remote.CourseApi
import com.example.courseapp.domain.model.Course
import com.example.courseapp.domain.model.Lesson
import com.example.courseapp.domain.repository.CourseRepository
import com.example.courseapp.util.ProgressCalculator
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import com.example.courseapp.util.ConnectivityObserver
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CourseRepositoryImpl @Inject constructor(
    private val courseApi: CourseApi,
    private val courseDao: CourseDao,
    private val connectivityObserver: ConnectivityObserver
) : CourseRepository {

    override suspend fun getCourses(forceRefresh: Boolean): Result<List<Course>> {
        // If device is offline, serve immediately from Room cache
        if (!connectivityObserver.isCurrentlyConnected()) {
            val cached = courseDao.getAllCourses().map { it.toDomain() }
            return if (cached.isNotEmpty()) {
                Result.success(cached)
            } else {
                Result.failure(Exception("You are offline. Connect to the internet to load courses."))
            }
        }

        return try {
            val remoteDtos = courseApi.getCourses()
            if (remoteDtos.isEmpty()) {
                val cached = courseDao.getAllCourses().map { it.toDomain() }
                return if (cached.isEmpty()) {
                    Result.success(emptyList())
                } else {
                    Result.success(cached)
                }
            }

            // Preserve local progress calculated from lessons if already completed
            val existingCourses = courseDao.getAllCourses().associateBy { it.id }
            val entitiesToSave = remoteDtos.map { dto ->
                val existing = existingCourses[dto.id]
                val lessonsInDb = courseDao.getLessonsForCourse(dto.id)
                val currentProgress = if (lessonsInDb.isNotEmpty()) {
                    val completed = lessonsInDb.count { it.completed }
                    ProgressCalculator.calculateProgress(completed, lessonsInDb.size)
                } else {
                    existing?.progress ?: dto.progress
                }

                CourseEntity(
                    id = dto.id,
                    title = dto.title,
                    instructor = dto.instructor,
                    progress = currentProgress,
                    lessons = lessonsInDb.size.takeIf { it > 0 } ?: dto.lessons
                )
            }

            // Insert courses first to satisfy foreign key relationships
            courseDao.insertCourses(entitiesToSave)

            // Sync initial lessons to Room for offline availability
            for (dto in remoteDtos) {
                val existingLessons = courseDao.getLessonsForCourse(dto.id)
                if (existingLessons.isEmpty()) {
                    val lessonDtos = courseApi.getLessonsForCourse(dto.id)
                    val entities = lessonDtos.map {
                        LessonEntity(
                            id = it.id,
                            courseId = it.courseId,
                            title = it.title,
                            completed = it.completed
                        )
                    }
                    courseDao.insertLessons(entities)
                }
            }

            Result.success(entitiesToSave.map { it.toDomain() })
        } catch (e: Exception) {
            // Remote failed - check Room cache for offline support
            val cached = courseDao.getAllCourses().map { it.toDomain() }
            if (cached.isNotEmpty()) {
                Result.success(cached)
            } else {
                Result.failure(Exception("Unable to load courses. Please check your connection and try again."))
            }
        }
    }

    override fun observeCourses(): Flow<List<Course>> {
        return courseDao.observeAllCourses().map { entities ->
            entities.map { it.toDomain() }
        }
    }

    override suspend fun getCourseById(courseId: Int): Course? {
        return courseDao.getCourseById(courseId)?.toDomain()
    }

    override fun observeCourseById(courseId: Int): Flow<Course?> {
        return courseDao.observeCourseById(courseId).map { it?.toDomain() }
    }

    override fun observeLessonsForCourse(courseId: Int): Flow<List<Lesson>> {
        return courseDao.observeLessonsForCourse(courseId).map { entities ->
            entities.map { it.toDomain() }
        }
    }

    override suspend fun toggleLessonCompletion(courseId: Int, lessonId: Int): Result<Unit> {
        return try {
            val lessons = courseDao.getLessonsForCourse(courseId)
            val target = lessons.find { it.id == lessonId }
                ?: return Result.failure(IllegalArgumentException("Lesson not found"))

            val newCompleted = !target.completed
            courseDao.updateLessonCompletion(lessonId, newCompleted)

            // Recalculate progress from all lessons for this course
            val updatedLessons = courseDao.getLessonsForCourse(courseId)
            val completedCount = updatedLessons.count { it.completed }
            val newProgress = ProgressCalculator.calculateProgress(completedCount, updatedLessons.size)

            courseDao.updateCourseProgress(courseId, newProgress)
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
