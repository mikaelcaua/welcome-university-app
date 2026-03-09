import { useCallback } from 'react';

import { Exam, ExamReviewRequest } from '@/interfaces';
import { apiRequest } from '@/lib/api';

export interface PendingExamFilters {
  stateId: number;
  universityId: number;
  courseId: number;
  subjectId: number;
}

interface ReviewExamPayload {
  examId: number;
  accessToken: string;
  payload: ExamReviewRequest;
}

export function useExamReviewService() {
  const getPendingExams = useCallback(
    async (accessToken: string, filters: PendingExamFilters): Promise<Exam[]> => {
      const query = new URLSearchParams({
        stateId: String(filters.stateId),
        universityId: String(filters.universityId),
        courseId: String(filters.courseId),
        subjectId: String(filters.subjectId),
      });

      return apiRequest<Exam[]>(`/exams/pending?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    [],
  );

  const reviewExam = useCallback(async ({ examId, accessToken, payload }: ReviewExamPayload) => {
    return apiRequest<Exam>(`/exams/${examId}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
  }, []);

  return {
    getPendingExams,
    reviewExam,
  };
}
