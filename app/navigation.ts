import { useRouter } from 'expo-router';

export function useWelcomeUniversityNavigation() {
  const router = useRouter();

  function goToStatesScreen() {
    router.dismissAll();
    router.replace('/state/view/view');
  }

  function goToUniversitiesScreen() {
    router.push('/university/view/view');
  }

  function goToCoursesAndSubjectsScreen() {
    router.push('/course_and_subject/view/view');
  }

  function goBack() {
    if (router.canGoBack()) {
      router.back();
    }
  }

  return {
    goToStatesScreen,
    goToUniversitiesScreen,
    goToCoursesAndSubjectsScreen,
    goBack,
  };
}
