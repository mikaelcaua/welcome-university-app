import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { University } from '@/interfaces';
import { useWelcomeUniversityNavigation } from '@/navigation/useWelcomeUniversityNavigation';
import { useSelectedFiltersStore } from '@/store';

import {
  SearchUniversityFormData,
  searchUniversitySchema,
} from '../../schemas/searchUniversitySchema';
import { useUniversityService } from '../../services/useUniversityService';

export function useUniversityViewModel() {
  const [loading, setLoading] = useState(false);
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);

  const { selectedStateId, setSelectedUniversityId } = useSelectedFiltersStore();
  const { goBack, goToCoursesAndSubjectsScreen } = useWelcomeUniversityNavigation();

  const { getUniversitiesByState } = useUniversityService();

  const form = useForm<SearchUniversityFormData>({
    resolver: zodResolver(searchUniversitySchema),
    defaultValues: { query: '' },
  });

  const searchQuery = form.watch('query');

  useEffect(() => {
    if (!searchQuery) {
      setFilteredUniversities(allUniversities);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = allUniversities.filter(
      (uni) =>
        uni.name.toLowerCase().includes(lowerQuery) ||
        (uni.abbreviation && uni.abbreviation.toLowerCase().includes(lowerQuery)),
    );
    setFilteredUniversities(filtered);
  }, [searchQuery, allUniversities]);

  const loadUniversities = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        const data = await getUniversitiesByState(id);
        setAllUniversities(data);
        setFilteredUniversities(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [getUniversitiesByState],
  );

  useEffect(() => {
    if (selectedStateId) {
      void loadUniversities(selectedStateId);
    } else {
      console.warn('Nenhum estado selecionado');
      goBack();
    }
  }, [goBack, loadUniversities, selectedStateId]);

  function handleSelectUniversity(universityId: number) {
    setSelectedUniversityId(universityId);
    goToCoursesAndSubjectsScreen();
  }

  return {
    loading,
    filteredUniversities,
    form,
    handleSelectUniversity,
    goBack,
  };
}
