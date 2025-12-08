import { API_URL } from '../../config/api';

export function useStateService() {
  async function getStateInfo(stateCode: string) {
    const res = await fetch(`${API_URL}/states/${stateCode}`);

    if (!res.ok) {
      throw new Error('Erro ao carregar dados do estado');
    }

    return await res.json();
  }

  return {
    getStateInfo,
  };
}
