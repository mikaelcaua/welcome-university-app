import { State } from './State';

export interface UniversitySummary {
  id: number;
  name: string;
}

export interface University extends UniversitySummary {
  state: State;
  abbreviation?: string | null;
}
