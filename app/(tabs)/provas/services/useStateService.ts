import { useCallback } from 'react';

import { State } from '@/interfaces';
import { API_URL } from '@/lib/api';

export function useStateService() {
  const getAllStates = useCallback(async (): Promise<State[]> => {
    const res = await fetch(`${API_URL}/states`);
    if (!res.ok) throw new Error('Erro ao carregar lista de estados');
    return await res.json();
  }, []);

  const getStateByCode = useCallback(async (stateCode: string): Promise<State> => {
    const res = await fetch(`${API_URL}/states/${stateCode}`);
    if (!res.ok) throw new Error('Erro ao carregar dados do estado');
    return await res.json();
  }, []);

  return {
    getAllStates,
    getStateByCode,
  };
}
