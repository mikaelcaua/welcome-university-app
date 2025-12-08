import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { State } from '@/interfaces';

import { SearchFormData, searchSchema } from '../schemas/searchStateSchema';
import { useStateService } from '../services/service';

export function useStatesViewModel() {
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState<State | undefined>(undefined);

  const [allStates, setAllStates] = useState<State[]>([]);
  const [filteredStates, setFilteredStates] = useState<State[]>([]);

  const [isSearching, setIsSearching] = useState(false);

  const { getStateByCode, getAllStates } = useStateService();

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: '' },
  });

  useEffect(() => {
    loadStatesList();
  }, []);

  const searchQuery = form.watch('query');

  useEffect(() => {
    if (!searchQuery) {
      setIsSearching(false);
      setFilteredStates([]);
      return;
    }

    setIsSearching(true);
    const lowerQuery = searchQuery.toLowerCase();

    const filtered = allStates.filter(
      (state) =>
        state.name.toLowerCase().includes(lowerQuery) ||
        state.code.toLowerCase().includes(lowerQuery)
    );

    setFilteredStates(filtered);
  }, [searchQuery, allStates]);

  async function loadStatesList() {
    try {
      const list = await getAllStates();
      setAllStates(list);
    } catch (e) {
      console.error('Erro ao carregar lista de estados', e);
    }
  }

  async function selectState(code: string) {
    try {
      setLoading(true);

      const result = await getStateByCode(code);
      setSelectedData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    data: selectedData,
    selectState,
    form,
    filteredStates,
    isSearching,
  };
}
