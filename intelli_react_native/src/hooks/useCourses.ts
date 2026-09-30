import { useState, useEffect, useCallback } from 'react';
import { DashboardUiState } from '../types/course';
import { defaultCourseRepository } from '../repositories/courseRepository';
import { normalizeError } from '../utils/errorHandler';
import { Logger } from '../utils/logger';

export const useCourses = () => {
  const [state, setState] = useState<DashboardUiState>({
    status: 'loading',
    courses: [],
    errorMessage: null,
    isFromCache: false,
    isRefreshing: false,
  });

  const loadCourses = useCallback(async (isRefresh = false) => {
    Logger.info('HOOK', `loadCourses initiated (isRefresh=${isRefresh})`);
    setState((prev) => ({
      ...prev,
      status: isRefresh ? prev.status : 'loading',
      isRefreshing: isRefresh,
      errorMessage: null,
    }));

    try {
      const result = await defaultCourseRepository.getCourses();
      if (!result.courses || result.courses.length === 0) {
        setState({
          status: 'empty',
          courses: [],
          errorMessage: null,
          isFromCache: result.isFromCache,
          isRefreshing: false,
        });
      } else {
        setState({
          status: 'success',
          courses: result.courses,
          errorMessage: null,
          isFromCache: result.isFromCache,
          isRefreshing: false,
        });
      }
    } catch (err) {
      const appErr = normalizeError(err, 'Unable to load courses. Please check your connection.');
      Logger.error('HOOK', 'Failed to load courses', appErr);
      setState((prev) => ({
        ...prev,
        status: prev.courses.length > 0 ? 'success' : 'error',
        errorMessage: appErr.userMessage,
        isRefreshing: false,
      }));
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const refresh = useCallback(async () => {
    await loadCourses(true);
  }, [loadCourses]);

  const retry = useCallback(async () => {
    await loadCourses(false);
  }, [loadCourses]);

  return {
    ...state,
    refresh,
    retry,
  };
};
