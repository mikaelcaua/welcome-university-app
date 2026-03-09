import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import { Course, Exam, ExamStatus, State, Subject, University, UserRole } from '@/interfaces';
import { useCourseSubjectService } from '@/app/(tabs)/provas/services/useCourseSubjectService';
import { useStateService } from '@/app/(tabs)/provas/services/useStateService';
import { useUniversityService } from '@/app/(tabs)/provas/services/useUniversityService';
import { useAuthService } from '@/services/auth/useAuthService';
import { useAuthStore } from '@/store';
import { ApiError } from '@/lib/api';

import { PendingExamFilters, useExamReviewService } from '../../services/useExamReviewService';
import {
  PendingExamFiltersFormData,
  pendingExamFiltersSchema,
} from '../../schemas/pendingExamFiltersSchema';

type ReviewStatus = ExamStatus.APPROVED | ExamStatus.REJECTED;
type NotesByExamId = Record<number, string>;
type LoadingByExamId = Record<number, boolean>;

const defaultValues: PendingExamFiltersFormData = {
  stateId: 0,
  universityId: 0,
  courseId: 0,
  subjectId: 0,
};

export function useExamReviewViewModel() {
  const [states, setStates] = useState<State[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingCascade, setLoadingCascade] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingExams, setPendingExams] = useState<Exam[]>([]);
  const [activeFilters, setActiveFilters] = useState<PendingExamFilters | null>(null);
  const [notesByExamId, setNotesByExamId] = useState<NotesByExamId>({});
  const [loadingByExamId, setLoadingByExamId] = useState<LoadingByExamId>({});

  const { accessToken, refreshToken, isAuthenticated, user, setSession, clearSession } =
    useAuthStore();
  const { refresh } = useAuthService();
  const { getAllStates } = useStateService();
  const { getUniversitiesByState } = useUniversityService();
  const { getCoursesByUniversity, getSubjectsByCourse } = useCourseSubjectService();
  const { getPendingExams, reviewExam } = useExamReviewService();

  const form = useForm<PendingExamFiltersFormData>({
    resolver: zodResolver(pendingExamFiltersSchema),
    defaultValues,
  });

  const hasReviewPermission =
    user?.role === UserRole.APPROVER ||
    user?.role === UserRole.ADMIN ||
    user?.role === UserRole.DEV;

  const loadStates = useCallback(async () => {
    try {
      setLoadingCascade(true);
      const data = await getAllStates();
      setStates(data);
    } catch (error) {
      Alert.alert('Erro ao carregar estados', getErrorMessage(error));
    } finally {
      setLoadingCascade(false);
    }
  }, [getAllStates]);

  useEffect(() => {
    void loadStates();
  }, [loadStates]);

  const executeWithAuthRetry = useCallback(
    async <T,>(request: (token: string) => Promise<T>): Promise<T> => {
      if (!accessToken) {
        throw new Error('Login necessário.');
      }

      try {
        return await request(accessToken);
      } catch (error) {
        if (!isAuthenticationError(error) || !refreshToken) {
          throw error;
        }

        try {
          const refreshedSession = await refresh(refreshToken);
          setSession({
            ...refreshedSession,
            refreshToken: refreshedSession.refreshToken || refreshToken,
            user: refreshedSession.user,
          });

          return await request(refreshedSession.accessToken);
        } catch (refreshError) {
          clearSession();
          throw refreshError;
        }
      }
    },
    [accessToken, clearSession, refresh, refreshToken, setSession],
  );

  const loadPendingExams = useCallback(
    async (filters: PendingExamFilters) => {
      if (!isAuthenticated || !hasReviewPermission) {
        return;
      }

      try {
        setLoading(true);
        const exams = await executeWithAuthRetry((token) => getPendingExams(token, filters));
        setPendingExams(exams);
      } catch (error) {
        Alert.alert('Erro ao carregar pendências', getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [executeWithAuthRetry, getPendingExams, hasReviewPermission, isAuthenticated],
  );

  async function handleStateSelect(stateId: number | string) {
    try {
      setLoadingCascade(true);
      setUniversities([]);
      setCourses([]);
      setSubjects([]);
      setActiveFilters(null);
      setPendingExams([]);
      form.setValue('universityId', 0);
      form.setValue('courseId', 0);
      form.setValue('subjectId', 0);

      const data = await getUniversitiesByState(Number(stateId));
      setUniversities(data);
    } catch (error) {
      Alert.alert('Erro ao carregar universidades', getErrorMessage(error));
    } finally {
      setLoadingCascade(false);
    }
  }

  async function handleUniversitySelect(universityId: number | string) {
    try {
      setLoadingCascade(true);
      setCourses([]);
      setSubjects([]);
      setActiveFilters(null);
      setPendingExams([]);
      form.setValue('courseId', 0);
      form.setValue('subjectId', 0);

      const data = await getCoursesByUniversity(Number(universityId));
      setCourses(data);
    } catch (error) {
      Alert.alert('Erro ao carregar cursos', getErrorMessage(error));
    } finally {
      setLoadingCascade(false);
    }
  }

  async function handleCourseSelect(courseId: number | string) {
    try {
      setLoadingCascade(true);
      setSubjects([]);
      setActiveFilters(null);
      setPendingExams([]);
      form.setValue('subjectId', 0);

      const data = await getSubjectsByCourse(Number(courseId));
      setSubjects(data);
    } catch (error) {
      Alert.alert('Erro ao carregar disciplinas', getErrorMessage(error));
    } finally {
      setLoadingCascade(false);
    }
  }

  function handleSubjectSelect() {
    setActiveFilters(null);
    setPendingExams([]);
  }

  const submitFilters = useCallback(
    async (values: PendingExamFiltersFormData) => {
      if (!isAuthenticated || !hasReviewPermission) {
        return;
      }

      const filters: PendingExamFilters = {
        stateId: values.stateId,
        universityId: values.universityId,
        courseId: values.courseId,
        subjectId: values.subjectId,
      };

      setActiveFilters(filters);
      await loadPendingExams(filters);
    },
    [hasReviewPermission, isAuthenticated, loadPendingExams],
  );

  const handleRefreshPending = useCallback(async () => {
    if (!activeFilters) {
      return;
    }

    await loadPendingExams(activeFilters);
  }, [activeFilters, loadPendingExams]);

  const submitReview = useCallback(
    async (examId: number, status: ReviewStatus) => {
      if (!isAuthenticated || !hasReviewPermission) {
        return;
      }

      try {
        setLoadingByExamId((current) => ({
          ...current,
          [examId]: true,
        }));

        const note = notesByExamId[examId]?.trim();
        await executeWithAuthRetry((token) =>
          reviewExam({
            examId,
            accessToken: token,
            payload: {
              status,
              ...(note ? { reviewNote: note } : {}),
            },
          }),
        );

        Alert.alert(
          'Revisão concluída',
          status === ExamStatus.APPROVED
            ? 'A prova foi aprovada com sucesso.'
            : 'A prova foi rejeitada com sucesso.',
        );

        if (activeFilters) {
          await loadPendingExams(activeFilters);
        } else {
          setPendingExams((current) => current.filter((exam) => exam.id !== examId));
        }

        setNotesByExamId((current) => {
          const next = { ...current };
          delete next[examId];
          return next;
        });
      } catch (error) {
        Alert.alert('Falha na revisão', getErrorMessage(error));
      } finally {
        setLoadingByExamId((current) => ({
          ...current,
          [examId]: false,
        }));
      }
    },
    [
      activeFilters,
      executeWithAuthRetry,
      hasReviewPermission,
      isAuthenticated,
      loadPendingExams,
      notesByExamId,
      reviewExam,
    ],
  );

  const handleApprove = useCallback(
    async (examId: number) => submitReview(examId, ExamStatus.APPROVED),
    [submitReview],
  );

  const handleReject = useCallback(
    async (examId: number) => submitReview(examId, ExamStatus.REJECTED),
    [submitReview],
  );

  function setReviewNote(examId: number, note: string) {
    setNotesByExamId((current) => ({
      ...current,
      [examId]: note,
    }));
  }

  function getReviewNote(examId: number) {
    return notesByExamId[examId] ?? '';
  }

  function isReviewing(examId: number) {
    return Boolean(loadingByExamId[examId]);
  }

  return {
    form,
    states,
    universities,
    courses,
    subjects,
    loadingCascade,
    loading,
    pendingExams,
    isAuthenticated,
    hasReviewPermission,
    hasAppliedFilters: Boolean(activeFilters),
    handleStateSelect,
    handleUniversitySelect,
    handleCourseSelect,
    handleSubjectSelect,
    handleRefreshPending,
    setReviewNote,
    getReviewNote,
    isReviewing,
    handleApprove,
    handleReject,
    onSubmitFilters: form.handleSubmit(submitFilters),
    hasSelectedState: Boolean(form.watch('stateId')),
    hasSelectedUniversity: Boolean(form.watch('universityId')),
    hasSelectedCourse: Boolean(form.watch('courseId')),
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Erro inesperado.';
}

function isAuthenticationError(error: unknown) {
  if (error instanceof ApiError) {
    return error.status === 401 || error.status === 403;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('401') ||
      message.includes('403') ||
      message.includes('unauthorized') ||
      message.includes('forbidden') ||
      message.includes('token')
    );
  }

  return false;
}
