import { useState } from 'react';

import { State } from '@/interfaces';

import { useStateService } from '../services/service';

export function useStatesViewModel() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<State | undefined>(undefined);

  const { getStateInfo } = useStateService();

  async function selectState(uf: string) {
    try {
      setLoading(true);
      const result = await getStateInfo(uf);
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return { loading, data, selectState };
}
