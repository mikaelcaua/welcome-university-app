import { useCallback } from 'react';

import { Course, Subject } from '@/interfaces';
import { API_URL } from '@/lib/api';

export function useCourseSubjectService() {
  const getCoursesByUniversity = useCallback(async (universityId: number): Promise<Course[]> => {
    const res = await fetch(`${API_URL}/universities/${universityId}/courses`);
    if (!res.ok) throw new Error('Erro ao buscar cursos');
    return await res.json();
  }, []);

  const getSubjectsByCourse = useCallback(async (courseId: number): Promise<Subject[]> => {
    const res = await fetch(`${API_URL}/courses/${courseId}/subjects`);
    if (!res.ok) throw new Error('Erro ao buscar disciplinas');
    return await res.json();
  }, []);

  return {
    getCoursesByUniversity,
    getSubjectsByCourse,
  };
}
