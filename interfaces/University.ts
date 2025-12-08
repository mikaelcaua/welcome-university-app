import { State } from './State';

export interface University {
  id: number;
  name: string;
  state: State;
  abbreviation?: string;
}
