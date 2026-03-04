import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { State } from '@/interfaces';
import { useWelcomeUniversityNavigation } from '@/navigation/useWelcomeUniversityNavigation';
import { useSelectedFiltersStore } from '@/store';

import {
  SearchStateFormData,
  searchStateSchema,
} from '../../schemas/searchStateSchema';
import { useStateService } from '../../services/useStateService';

export function useStatesViewModel() {
  const [loading, setLoading] = useState(false);
  const [allStates, setAllStates] = useState<State[]>([]);
  const [filteredStates, setFilteredStates] = useState<State[]>([]);

  const { getAllStates } = useStateService();
  const { setSelectedStateId } = useSelectedFiltersStore();
  const { goToUniversitiesScreen } = useWelcomeUniversityNavigation();

  const form = useForm<SearchStateFormData>({
    resolver: zodResolver(searchStateSchema),
    defaultValues: { query: '' },
  });

  const searchQuery = form.watch('query');

  useEffect(() => {
    if (!searchQuery) {
      setFilteredStates(allStates);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = allStates.filter(
      (state) =>
        state.name.toLowerCase().includes(lowerQuery) ||
        state.code.toLowerCase().includes(lowerQuery),
    );
    setFilteredStates(filtered);
  }, [searchQuery, allStates]);

  const loadStatesList = useCallback(async () => {
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
  }, [getAllStates]);

  useEffect(() => {
    void loadStatesList();
  }, [loadStatesList]);

  async function selectState(id: number) {
    try {
      setLoading(true);
      setSelectedStateId(id);
      goToUniversitiesScreen();
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
