import { CourseSummary } from './Course';

export interface SubjectSummary {
  id: number;
  name: string;
}

export interface Subject extends SubjectSummary {
  course: CourseSummary;
}
