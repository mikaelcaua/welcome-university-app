import { useCallback } from 'react';

import { Exam } from '@/interfaces';
import { apiRequest } from '@/lib/api';
import { CACHE_KEYS, getCachedOrFetch } from '@/lib/offlineCache';

export function useExamsService() {
  const getExamsBySubject = useCallback(async (subjectId: number): Promise<Exam[]> => {
    return getCachedOrFetch({
      cacheKey: CACHE_KEYS.examsBySubject(subjectId),
      alertTitle: 'Provas offline',
      request: () => apiRequest<Exam[]>(`/subjects/${subjectId}/exams`),
    });
  }, []);

  return {
    getExamsBySubject,
  };
}
