import { API_URL } from '@/app/config/api';

import { University } from '@/interfaces';

export function useUniversityService() {
  async function getUniversitiesByState(stateId: number): Promise<University[]> {
    const res = await fetch(`${API_URL}/states/${stateId}/universities`);

    if (!res.ok) {
      throw new Error('Erro ao carregar universidades deste estado.');
    }

    return await res.json();
  }

  return {
    getUniversitiesByState,
  };
}
