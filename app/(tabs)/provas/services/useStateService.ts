import { useCallback } from 'react';

import { State } from '@/interfaces';
import { apiRequest } from '@/lib/api';
import { CACHE_KEYS, getCachedOrFetch } from '@/lib/offlineCache';

export function useStateService() {
  const getAllStates = useCallback(async (): Promise<State[]> => {
    return getCachedOrFetch({
      cacheKey: CACHE_KEYS.states,
      alertTitle: 'Lista de estados offline',
      request: () => apiRequest<State[]>('/states'),
    });
  }, []);

  const getStateByCode = useCallback(async (stateCode: string): Promise<State> => {
    return apiRequest<State>(`/states/${stateCode}`);
  }, []);

  return {
    getAllStates,
    getStateByCode,
  };
}
