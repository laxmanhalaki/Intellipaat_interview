package com.example.courseapp.presentation.details

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.courseapp.domain.repository.CourseRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class CourseDetailsViewModel @Inject constructor(
    private val courseRepository: CourseRepository,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val courseId: Int = checkNotNull(savedStateHandle["courseId"])

    private val _uiState = MutableStateFlow<CourseDetailsUiState>(CourseDetailsUiState.Loading)
    val uiState: StateFlow<CourseDetailsUiState> = _uiState.asStateFlow()

    init {
        loadCourseDetails()
    }

    private fun loadCourseDetails() {
        viewModelScope.launch {
            combine(
                courseRepository.observeCourseById(courseId),
                courseRepository.observeLessonsForCourse(courseId)
            ) { course, lessons ->
                if (course == null) {
                    CourseDetailsUiState.Loading
                } else {
                    CourseDetailsUiState.Success(course = course, lessons = lessons)
                }
            }.collect { state ->
                _uiState.value = state
            }
        }
    }

    fun toggleLesson(lessonId: Int) {
        viewModelScope.launch {
            courseRepository.toggleLessonCompletion(courseId, lessonId)
        }
    }
}
