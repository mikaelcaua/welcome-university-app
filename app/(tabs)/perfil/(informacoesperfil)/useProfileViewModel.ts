import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import { useAuthService } from '@/services/auth/useAuthService';
import { useAuthStore } from '@/store';

import { AuthFormData, authFormSchema } from '../schemas/authFormSchema';

type AuthMode = 'login' | 'register';

export function useProfileViewModel() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { register, login, refresh, getAuthenticatedUser } = useAuthService();
  const {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    hasHydrated,
    setSession,
    setUser,
    clearSession,
  } = useAuthStore();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const handleRefreshProfile = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    try {
      setIsRefreshing(true);
      const profile = await getAuthenticatedUser(accessToken);
      setUser(profile);
    } catch (error) {
      if (refreshToken) {
        try {
          const refreshedSession = await refresh(refreshToken);
          const profile = await getAuthenticatedUser(refreshedSession.accessToken);

          setSession({
            ...refreshedSession,
            refreshToken: refreshedSession.refreshToken || refreshToken,
            user: profile,
          });
          return;
        } catch {
          clearSession();
        }
      }

      Alert.alert('Sessão inválida', getErrorMessage(error));
    } finally {
      setIsRefreshing(false);
    }
  }, [
    accessToken,
    clearSession,
    getAuthenticatedUser,
    refresh,
    refreshToken,
    setSession,
    setUser,
  ]);

  useEffect(() => {
    if (isAuthenticated && accessToken && !user) {
      void handleRefreshProfile();
    }
  }, [accessToken, handleRefreshProfile, isAuthenticated, user]);

  async function submit(values: AuthFormData) {
    try {
      setIsSubmitting(true);

      const normalizedEmail = values.email.trim().toLowerCase();
      const session =
        mode === 'register'
          ? await register({
              name: values.name.trim(),
              email: normalizedEmail,
              password: values.password,
            })
          : await login({
              email: normalizedEmail,
              password: values.password,
            });

      const profile = await getAuthenticatedUser(session.accessToken).catch(() => session.user);

      setSession({
        ...session,
        user: profile,
      });
      form.reset();
      Alert.alert(
        mode === 'register' ? 'Conta criada' : 'Sessão iniciada',
        'Seu perfil autenticado já está disponível.',
      );
    } catch (error) {
      Alert.alert('Não foi possível autenticar', getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleLogout() {
    Alert.alert('Sair da conta', 'Deseja encerrar a sessão neste dispositivo?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: clearSession,
      },
    ]);
  }

  return {
    form,
    mode,
    user,
    isSubmitting,
    isRefreshing,
    isAuthenticated,
    hasHydrated,
    setMode,
    handleLogout,
    handleRefreshProfile,
    onSubmit: form.handleSubmit(submit),
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Erro inesperado.';
}
