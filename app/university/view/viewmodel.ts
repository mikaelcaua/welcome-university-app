import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { University } from '@/interfaces';

import { searchSchema } from '@/app/states/schemas/searchStateSchema';
import { SearchFormData } from '../schemas/searchUniversitySchema';
import { useUniversityService } from '../service/useUniversityService';

export function useUniversityViewModel() {
  const [loading, setLoading] = useState(false);
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);

  const { stateId } = useLocalSearchParams<{ stateId: string }>();

  const { getUniversitiesByState } = useUniversityService();

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: '' },
  });

  const searchQuery = form.watch('query');

  useEffect(() => {
    if (stateId) {
      loadUniversities(Number(stateId));
    }
  }, [stateId]);

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
    console.log('Universidade selecionada:', universityId);
    // Navegar para a próxima tela (Ex: Cursos)
    // router.push(`/courses?universityId=${universityId}`);
  }

  return {
    loading,
    filteredUniversities,
    form,
    handleSelectUniversity,
  };
}
