import { useState, useEffect, useCallback } from 'react';
import { CourseDetailsUiState } from '../types/course';
import { defaultCourseRepository } from '../repositories/courseRepository';
import { normalizeError } from '../utils/errorHandler';
import { Logger } from '../utils/logger';

export const useCourseDetails = (courseId: number) => {
  const [state, setState] = useState<CourseDetailsUiState>({
    status: 'loading',
    course: null,
    lessons: [],
    errorMessage: null,
  });

  const loadDetails = useCallback(async () => {
    Logger.info('HOOK', `Loading details for courseId: ${courseId}`);
    setState((prev) => ({ ...prev, status: 'loading', errorMessage: null }));

    try {
      const { course, lessons } = await defaultCourseRepository.getCourseDetails(courseId);
      setState({
        status: 'success',
        course,
        lessons,
        errorMessage: null,
      });
    } catch (err) {
      const appErr = normalizeError(err, 'Unable to load course details.');
      Logger.error('HOOK', `Failed to load details for course ${courseId}`, appErr);
      setState((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: appErr.userMessage,
      }));
    }
  }, [courseId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  return {
    ...state,
    retry: loadDetails,
  };
};
