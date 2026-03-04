import { useCallback } from 'react';
import { useRouter } from 'expo-router';

export function useWelcomeUniversityNavigation() {
  const router = useRouter();

  const goToStatesScreen = useCallback(() => {
    router.dismissAll();
    router.replace('/provas');
  }, [router]);

  const goToUniversitiesScreen = useCallback(() => {
    router.push('/provas/universities');
  }, [router]);

  const goToCoursesAndSubjectsScreen = useCallback(() => {
    router.push('/provas/courses');
  }, [router]);

  const goToExamsScreen = useCallback(() => {
    router.push('/provas/exams');
  }, [router]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  return {
    goToStatesScreen,
    goToUniversitiesScreen,
    goToCoursesAndSubjectsScreen,
    goToExamsScreen,
    goBack,
  };
}
