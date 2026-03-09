import { useCallback } from 'react';

import { Exam, ExamUploadRequest } from '@/interfaces';
import { apiRequest } from '@/lib/api';
import { LocalAttachment } from '@/lib/filesystem';

interface SubmitExamPayload extends ExamUploadRequest {
  accessToken: string;
  file: LocalAttachment;
}

export function useExamSubmissionService() {
  const submitExam = useCallback(async (payload: SubmitExamPayload): Promise<Exam> => {
    const formData = new FormData();

    formData.append('examYear', String(payload.examYear));
    formData.append('semester', String(payload.semester));
    formData.append('type', payload.type);
    formData.append('subjectId', String(payload.subjectId));
    formData.append('file', {
      uri: payload.file.uri,
      name: normalizeFileName(payload.file),
      type: payload.file.mimeType,
    } as never);

    return apiRequest<Exam>('/exams', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${payload.accessToken}`,
      },
      body: formData,
    });
  }, []);

  const getCurrentUserPendingExams = useCallback(async (accessToken: string): Promise<Exam[]> => {
    return apiRequest<Exam[]>('/users/me/exams/pending', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }, []);

  return {
    submitExam,
    getCurrentUserPendingExams,
  };
}

function normalizeFileName(file: LocalAttachment) {
  const trimmed = file.name.trim();

  if (!trimmed) {
    return file.kind === 'pdf' ? 'prova.pdf' : 'anexo-prova.jpg';
  }

  return trimmed;
}
