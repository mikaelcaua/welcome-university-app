import { useCallback } from 'react';

import { Exam, ExamUploadRequest } from '@/interfaces';
import { apiRequest } from '@/lib/api';

interface SubmitExamPayload extends ExamUploadRequest {
  accessToken: string;
  pdfUri: string;
  fileName: string;
}

export function useExamSubmissionService() {
  const submitExam = useCallback(async (payload: SubmitExamPayload): Promise<Exam> => {
    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('examYear', String(payload.examYear));
    formData.append('semester', String(payload.semester));
    formData.append('type', payload.type);
    formData.append('subjectId', String(payload.subjectId));
    formData.append('file', {
      uri: payload.pdfUri,
      name: normalizeFileName(payload.fileName),
      type: 'application/pdf',
    } as never);

    return apiRequest<Exam>('/exams', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${payload.accessToken}`,
      },
      body: formData,
    });
  }, []);

  return {
    submitExam,
  };
}

function normalizeFileName(fileName: string) {
  const trimmed = fileName.trim();

  if (!trimmed) {
    return 'prova.pdf';
  }

  return trimmed.toLowerCase().endsWith('.pdf') ? trimmed : `${trimmed}.pdf`;
}
