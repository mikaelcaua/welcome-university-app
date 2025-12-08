import { Subject } from './Subject';

export enum ExamType {
  PROVA1 = 'PROVA1',
  PROVA2 = 'PROVA2',
  PROVA3 = 'PROVA3',
  RECUPERACAO = 'RECUPERACAO',
  FINAL = 'FINAL',
}

export interface Exam {
  id: number;
  name: string;
  examYear: number;
  semester: number;
  pdfUrl: string;
  type: ExamType;
  subject: Subject;
}

export interface ExamSection {
  title: string;
  data: Exam[];
}
