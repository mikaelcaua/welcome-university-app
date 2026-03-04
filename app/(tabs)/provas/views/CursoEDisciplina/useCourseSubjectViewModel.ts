import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Course, Subject } from '@/interfaces';
import { useWelcomeUniversityNavigation } from '@/navigation/useWelcomeUniversityNavigation';
import { useSelectedFiltersStore } from '@/store/useSelectedFiltersStore';

import {
  CourseSubjectFormData,
  courseSubjectSchema,
} from '../../schemas/courseSubjectSchema';
import { useCourseSubjectService } from '../../services/useCourseSubjectService';

export function useCourseSubjectViewModel() {
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const { selectedUniversityId, setSelectedCourseId, setSelectedSubjectId } =
    useSelectedFiltersStore();
  const { getCoursesByUniversity, getSubjectsByCourse } = useCourseSubjectService();
  const { goToExamsScreen } = useWelcomeUniversityNavigation();

  const form = useForm<CourseSubjectFormData>({
    resolver: zodResolver(courseSubjectSchema),
  });

  const loadCourses = useCallback(
    async (uniId: number) => {
      try {
        setLoadingCourses(true);
        const data = await getCoursesByUniversity(uniId);
        setCourses(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingCourses(false);
      }
    },
    [getCoursesByUniversity],
  );

  useEffect(() => {
    if (selectedUniversityId) {
      void loadCourses(selectedUniversityId);
    } else {
      console.warn('Nenhuma universidade selecionada');
    }
  }, [loadCourses, selectedUniversityId]);

  async function onSelectCourse(courseId: number | string) {
    form.setValue('subjectId', 0);
    setSubjects([]);

    try {
      setLoadingSubjects(true);
      const data = await getSubjectsByCourse(Number(courseId));
      setSubjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSubjects(false);
    }
  }

  const onSubmit = (data: CourseSubjectFormData) => {
    setSelectedCourseId(data.courseId);
    setSelectedSubjectId(data.subjectId);
    goToExamsScreen();
  };

  return {
    form,
    courses,
    subjects,
    loadingCourses,
    loadingSubjects,
    onSelectCourse,
    onSubmit: form.handleSubmit(onSubmit),
    isCourseSelected: !!form.watch('courseId'),
  };
}
