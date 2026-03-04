import { useCallback } from 'react';

import { University } from '@/interfaces';
import { API_URL } from '@/lib/api';

export function useUniversityService() {
  const getUniversitiesByState = useCallback(async (stateId: number): Promise<University[]> => {
    const res = await fetch(`${API_URL}/states/${stateId}/universities`);

    if (!res.ok) {
      throw new Error('Erro ao carregar universidades deste estado.');
    }

    return await res.json();
  }, []);

  return {
    getUniversitiesByState,
  };
}
