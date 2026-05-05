import { useCallback } from 'react';

import { University } from '@/interfaces';
import { apiRequest } from '@/lib/api';
import { CACHE_KEYS, getCachedOrFetch } from '@/lib/offlineCache';

export function useUniversityService() {
  const getUniversitiesByState = useCallback(async (stateId: number): Promise<University[]> => {
    return getCachedOrFetch({
      cacheKey: CACHE_KEYS.universitiesByState(stateId),
      alertTitle: 'Universidades offline',
      request: () => apiRequest<University[]>(`/states/${stateId}/universities`),
    });
  }, []);

  return {
    getUniversitiesByState,
  };
}
