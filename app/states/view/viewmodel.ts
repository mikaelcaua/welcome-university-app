import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { State } from '@/interfaces';
import { SearchFormData, searchSchema } from '../schemas/searchStateSchema';
import { useStateService } from '../services/service';

export function useStatesViewModel() {
  const [loading, setLoading] = useState(false);

  const [allStates, setAllStates] = useState<State[]>([]);
  const [filteredStates, setFilteredStates] = useState<State[]>([]);

  const { getAllStates } = useStateService();

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: '' },
  });

  const searchQuery = form.watch('query');

  useEffect(() => {
    loadStatesList();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredStates(allStates);
      return;
    }

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
      setLoading(true);
      const list = await getAllStates();
      setAllStates(list);
      setFilteredStates(list);
    } catch (e) {
      console.error('Erro ao carregar lista de estados', e);
    } finally {
      setLoading(false);
    }
  }

  function handleNext(id: number) {
    console.log('Avançar com estado:', id);
  }

  async function selectState(id: number) {
    try {
      setLoading(true);
      handleNext(id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,

    selectState,
    filteredStates,

    form,
  };
}
