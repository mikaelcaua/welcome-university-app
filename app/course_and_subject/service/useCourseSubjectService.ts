import { API_URL } from '@/app/config/api';

import { Course, Subject } from '@/interfaces';

export function useCourseSubjectService() {
  async function getCoursesByUniversity(universityId: number): Promise<Course[]> {
    const res = await fetch(`${API_URL}/universities/${universityId}/courses`);
    if (!res.ok) throw new Error('Erro ao buscar cursos');
    return await res.json();
  }

  async function getSubjectsByCourse(courseId: number): Promise<Subject[]> {
    const res = await fetch(`${API_URL}/courses/${courseId}/subjects`);
    if (!res.ok) throw new Error('Erro ao buscar disciplinas');
    return await res.json();
  }

  return {
    getCoursesByUniversity,
    getSubjectsByCourse,
  };
}
