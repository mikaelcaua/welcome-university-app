import { UniversitySummary } from './University';

export interface CourseSummary {
  id: number;
  name: string;
}

export interface Course extends CourseSummary {
  university: UniversitySummary;
}
