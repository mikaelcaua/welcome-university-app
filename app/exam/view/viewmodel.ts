import { useEffect, useState } from 'react';

import { useWelcomeUniversityNavigation } from '@/app/navigation';
import { Exam, ExamSection } from '@/interfaces';
import { useSelectedFiltersStore } from '@/store';

import { useExamsService } from '../service/useExamsService';

export function useExamsViewModel() {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<ExamSection[]>([]);

  const { selectedSubjectId } = useSelectedFiltersStore();
  const { goBack } = useWelcomeUniversityNavigation();
  const { getExamsBySubject } = useExamsService();

  useEffect(() => {
    if (selectedSubjectId) {
      loadExams(selectedSubjectId);
    } else {
      console.warn('Nenhuma disciplina selecionada');
    }
  }, [selectedSubjectId]);

  async function loadExams(subjectId: number) {
    try {
      setLoading(true);
      const data = await getExamsBySubject(subjectId);
      const grouped = groupExamsBySemester(data);
      setSections(grouped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function groupExamsBySemester(exams: Exam[]): ExamSection[] {
    const groups: Record<string, Exam[]> = {};

    exams.forEach((exam) => {
      const key = `${exam.examYear}.${exam.semester}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(exam);
    });

    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .map((key) => ({
        title: key,
        data: groups[key].sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }

  return {
    loading,
    sections,
    goBack,
  };
}
