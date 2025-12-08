import { State } from '@/interfaces';

import { API_URL } from '../../config/api';

export function useStateService() {
  async function getAllStates(): Promise<State[]> {
    const res = await fetch(`${API_URL}/states`);
    if (!res.ok) throw new Error('Erro ao carregar lista de estados');
    return await res.json();
  }

  async function getStateByCode(stateCode: string): Promise<State> {
    const res = await fetch(`${API_URL}/states/${stateCode}`);
    if (!res.ok) throw new Error('Erro ao carregar dados do estado');
    return await res.json();
  }

  return {
    getAllStates,
    getStateByCode,
  };
}
