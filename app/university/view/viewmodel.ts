import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useWelcomeUniversityNavigation } from '@/app/navigation';
import { University } from '@/interfaces';
import { useSelectedFiltersStore } from '@/store';

import {
  SearchUniversityFormData,
  searchUniversitySchema,
} from '../schemas/searchUniversitySchema';
import { useUniversityService } from '../service/useUniversityService';

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
    if (selectedStateId) {
      loadUniversities(selectedStateId);
    } else {
      console.warn('Nenhum estado selecionado');
      goBack();
    }
  }, [selectedStateId]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredUniversities(allUniversities);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = allUniversities.filter(
      (uni) =>
        uni.name.toLowerCase().includes(lowerQuery) ||
        (uni.abbreviation && uni.abbreviation.toLowerCase().includes(lowerQuery))
    );
    setFilteredUniversities(filtered);
  }, [searchQuery, allUniversities]);

  async function loadUniversities(id: number) {
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
  }

  function handleSelectUniversity(universityId: number) {
    setSelectedUniversityId(universityId);

    goToCoursesAndSubjectsScreen();
  }

  return {
    loading,
    filteredUniversities,
    form,
    handleSelectUniversity,
  };
}
