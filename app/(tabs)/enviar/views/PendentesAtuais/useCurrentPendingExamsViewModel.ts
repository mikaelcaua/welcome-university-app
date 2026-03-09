import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { Exam } from '@/interfaces';
import { ApiError } from '@/lib/api';
import { useAuthService } from '@/services/auth/useAuthService';
import { useAuthStore } from '@/store';

import { useExamSubmissionService } from '../../service/useExamSubmissionService';

export function useCurrentPendingExamsViewModel() {
  const [loading, setLoading] = useState(true);
  const [pendingExams, setPendingExams] = useState<Exam[]>([]);

  const router = useRouter();
  const { refresh } = useAuthService();
  const { getCurrentUserPendingExams } = useExamSubmissionService();
  const { accessToken, refreshToken, isAuthenticated, setSession, clearSession } = useAuthStore();

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

  const loadCurrentPendingExams = useCallback(async () => {
    if (!isAuthenticated) {
      setPendingExams([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const exams = await executeWithAuthRetry((token) => getCurrentUserPendingExams(token));
      setPendingExams(exams);
    } catch (error) {
      Alert.alert('Erro ao carregar pendências', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [executeWithAuthRetry, getCurrentUserPendingExams, isAuthenticated]);

  useEffect(() => {
    void loadCurrentPendingExams();
  }, [loadCurrentPendingExams]);

  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/enviar');
  }

  return {
    loading,
    pendingExams,
    isAuthenticated,
    loadCurrentPendingExams,
    goBack,
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
