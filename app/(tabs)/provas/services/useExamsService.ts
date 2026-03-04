import { useCallback } from 'react';

import { Exam } from '@/interfaces';
import { apiRequest } from '@/lib/api';

export function useExamsService() {
  const getExamsBySubject = useCallback(async (subjectId: number): Promise<Exam[]> => {
    return apiRequest<Exam[]>(`/subjects/${subjectId}/exams`);
  }, []);

  return {
    getExamsBySubject,
  };
}
