import { API_URL } from '@/app/config/api';

import { Exam } from '@/interfaces';

export function useExamsService() {
  async function getExamsBySubject(subjectId: number): Promise<Exam[]> {
    const res = await fetch(`${API_URL}/subjects/${subjectId}/exams`);

    if (!res.ok) {
      throw new Error('Erro ao buscar provas.');
    }

    return await res.json();
  }

  return {
    getExamsBySubject,
  };
}
