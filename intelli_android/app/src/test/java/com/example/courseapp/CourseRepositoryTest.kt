package com.example.courseapp

import com.example.courseapp.data.local.CourseDao
import com.example.courseapp.data.local.CourseEntity
import com.example.courseapp.data.local.LessonEntity
import com.example.courseapp.data.remote.CourseApi
import com.example.courseapp.data.remote.CourseDto
import com.example.courseapp.data.remote.LessonDto
import com.example.courseapp.data.repository.CourseRepositoryImpl
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.test.runTest
import com.example.courseapp.util.ConnectivityObserver
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import java.io.IOException

class CourseRepositoryTest {

    private lateinit var fakeApi: FakeCourseApi
    private lateinit var fakeDao: FakeCourseDao
    private lateinit var fakeConnectivity: FakeConnectivityObserver
    private lateinit var repository: CourseRepositoryImpl

    @Before
    fun setUp() {
        fakeApi = FakeCourseApi()
        fakeDao = FakeCourseDao()
        fakeConnectivity = FakeConnectivityObserver(isOnline = true)
        repository = CourseRepositoryImpl(fakeApi, fakeDao, fakeConnectivity)
    }

    @Test
    fun `getCourses fetches from remote and caches into local database on success`() = runTest {
        val result = repository.getCourses()

        assertTrue(result.isSuccess)
        val courses = result.getOrNull()!!
        assertEquals(2, courses.size)
        assertEquals("Course 1", courses[0].title)

        // Verify stored in DAO
        val daoCourses = fakeDao.getAllCourses()
        assertEquals(2, daoCourses.size)
    }

    @Test
    fun `getCourses returns cached data when remote fails and cache is available`() = runTest {
        // Pre-populate DAO
        fakeDao.insertCourses(
            listOf(
                CourseEntity(1, "Cached Course", "Cached Instructor", 50, 4)
            )
        )

        // Configure remote to fail
        fakeApi.shouldThrow = true

        val result = repository.getCourses()

        assertTrue(result.isSuccess)
        val courses = result.getOrNull()!!
        assertEquals(1, courses.size)
        assertEquals("Cached Course", courses[0].title)
    }

    @Test
    fun `getCourses returns failure when remote fails and cache is empty`() = runTest {
        fakeApi.shouldThrow = true

        val result = repository.getCourses()

        assertTrue(result.isFailure)
    }

    @Test
    fun `getCourses returns cached data directly when offline`() = runTest {
        fakeDao.insertCourses(
            listOf(CourseEntity(1, "Offline Course", "Offline Instructor", 100, 3))
        )
        fakeConnectivity.setConnected(false)

        val result = repository.getCourses()

        assertTrue(result.isSuccess)
        val courses = result.getOrNull()!!
        assertEquals(1, courses.size)
        assertEquals("Offline Course", courses[0].title)
    }

    @Test
    fun `getCourses returns failure when offline and cache is empty`() = runTest {
        fakeConnectivity.setConnected(false)

        val result = repository.getCourses()

        assertTrue(result.isFailure)
    }

    @Test
    fun `toggleLessonCompletion updates lesson and recalculates course progress`() = runTest {
        val course = CourseEntity(1, "Kotlin Course", "Instructor", 0, 2)
        val lesson1 = LessonEntity(101, 1, "Lesson 1", false)
        val lesson2 = LessonEntity(102, 1, "Lesson 2", false)

        fakeDao.insertCourses(listOf(course))
        fakeDao.insertLessons(listOf(lesson1, lesson2))

        val result = repository.toggleLessonCompletion(courseId = 1, lessonId = 101)

        assertTrue(result.isSuccess)

        // Verify lesson 101 is completed
        val updatedLessons = fakeDao.getLessonsForCourse(1)
        val targetLesson = updatedLessons.find { it.id == 101 }!!
        assertTrue(targetLesson.completed)

        // Verify course progress recalculated: 1 / 2 = 50%
        val updatedCourse = fakeDao.getCourseById(1)!!
        assertEquals(50, updatedCourse.progress)
    }

    // Fakes
    private class FakeConnectivityObserver(
        var isOnline: Boolean = true
    ) : ConnectivityObserver {
        private val flow = MutableStateFlow(isOnline)

        override val isConnected: Flow<Boolean> get() = flow

        override fun isCurrentlyConnected(): Boolean = isOnline

        fun setConnected(connected: Boolean) {
            isOnline = connected
            flow.value = connected
        }
    }
    private class FakeCourseApi : CourseApi {
        var shouldThrow = false

        override suspend fun getCourses(): List<CourseDto> {
            if (shouldThrow) throw IOException("Remote network failure")
            return listOf(
                CourseDto(1, "Course 1", "Instructor 1", 0, 2),
                CourseDto(2, "Course 2", "Instructor 2", 25, 4)
            )
        }

        override suspend fun getLessonsForCourse(courseId: Int): List<LessonDto> {
            if (shouldThrow) throw IOException("Remote network failure")
            return listOf(
                LessonDto(101, courseId, "Intro", false),
                LessonDto(102, courseId, "Advanced", false)
            )
        }
    }

    private class FakeCourseDao : CourseDao {
        private val coursesMap = mutableMapOf<Int, CourseEntity>()
        private val lessonsMap = mutableMapOf<Int, LessonEntity>()
        private val coursesFlow = MutableStateFlow<List<CourseEntity>>(emptyList())
        private val lessonsFlow = MutableStateFlow<List<LessonEntity>>(emptyList())

        override fun observeAllCourses(): Flow<List<CourseEntity>> = coursesFlow

        override suspend fun getAllCourses(): List<CourseEntity> = coursesMap.values.toList()

        override suspend fun getCourseById(courseId: Int): CourseEntity? = coursesMap[courseId]

        override fun observeCourseById(courseId: Int): Flow<CourseEntity?> {
            return coursesFlow.map { list -> list.find { it.id == courseId } }
        }

        override suspend fun insertCourses(courses: List<CourseEntity>) {
            courses.forEach { coursesMap[it.id] = it }
            coursesFlow.value = coursesMap.values.toList()
        }

        override suspend fun updateCourseProgress(courseId: Int, progress: Int) {
            coursesMap[courseId]?.let {
                val updated = it.copy(progress = progress)
                coursesMap[courseId] = updated
                coursesFlow.value = coursesMap.values.toList()
            }
        }

        override fun observeLessonsForCourse(courseId: Int): Flow<List<LessonEntity>> {
            return lessonsFlow.map { list -> list.filter { it.courseId == courseId } }
        }

        override suspend fun getLessonsForCourse(courseId: Int): List<LessonEntity> {
            return lessonsMap.values.filter { it.courseId == courseId }
        }

        override suspend fun insertLessons(lessons: List<LessonEntity>) {
            lessons.forEach { lessonsMap[it.id] = it }
            lessonsFlow.value = lessonsMap.values.toList()
        }

        override suspend fun updateLessonCompletion(lessonId: Int, completed: Boolean) {
            lessonsMap[lessonId]?.let {
                val updated = it.copy(completed = completed)
                lessonsMap[lessonId] = updated
                lessonsFlow.value = lessonsMap.values.toList()
            }
        }
    }
}
