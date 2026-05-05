import { useCallback } from 'react';

import { Course, Subject } from '@/interfaces';
import { apiRequest } from '@/lib/api';
import { CACHE_KEYS, getCachedOrFetch } from '@/lib/offlineCache';

export function useCourseSubjectService() {
  const getCoursesByUniversity = useCallback(async (universityId: number): Promise<Course[]> => {
    return getCachedOrFetch({
      cacheKey: CACHE_KEYS.coursesByUniversity(universityId),
      alertTitle: 'Cursos offline',
      request: () => apiRequest<Course[]>(`/universities/${universityId}/courses`),
    });
  }, []);

  const getSubjectsByCourse = useCallback(async (courseId: number): Promise<Subject[]> => {
    return getCachedOrFetch({
      cacheKey: CACHE_KEYS.subjectsByCourse(courseId),
      alertTitle: 'Disciplinas offline',
      request: () => apiRequest<Subject[]>(`/courses/${courseId}/subjects`),
    });
  }, []);

  return {
    getCoursesByUniversity,
    getSubjectsByCourse,
  };
}
