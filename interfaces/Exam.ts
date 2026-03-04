import { UserSummary } from './User';

export enum ExamType {
  EXAM = 'EXAM',
  PROVA1 = 'PROVA1',
  PROVA2 = 'PROVA2',
  PROVA3 = 'PROVA3',
  RECUPERACAO = 'RECUPERACAO',
  FINAL = 'FINAL',
}

export enum ExamStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface ExamPeriodQuery {
  subjectId?: number;
  period?: `${number}.${1 | 2}`;
}

export interface ExamUploadRequest {
  examYear: number;
  semester: 1 | 2;
  type: ExamType;
  subjectId: number;
}

export interface ExamReviewRequest {
  status: ExamStatus.APPROVED | ExamStatus.REJECTED;
  reviewNote?: string;
}

export interface Exam {
  id: number;
  name: string;
  examYear: number;
  semester: 1 | 2;
  type: ExamType;
  pdfUrl: string;
  status: ExamStatus;
  subjectId: number;
  subjectName: string;
  uploadedBy: UserSummary;
  reviewedBy: UserSummary | null;
  reviewNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

export interface ExamSection {
  title: string;
  data: Exam[];
}
