import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { AppUser, AuthSession } from '@/interfaces';
import { AUTH_STORAGE_KEY, zustandStorage } from '@/lib/storage';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  expiresInSeconds: number | null;
  user: AppUser | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setSession: (session: AuthSession) => void;
  setUser: (user: AppUser) => void;
  setHasHydrated: (value: boolean) => void;
  clearSession: () => void;
}

const initialState = {
  accessToken: null,
  refreshToken: null,
  tokenType: null,
  expiresInSeconds: null,
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      hasHydrated: false,
      setSession: (session) =>
        set({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          tokenType: session.tokenType,
          expiresInSeconds: session.expiresInSeconds,
          user: session.user,
          isAuthenticated: true,
        }),
      setUser: (user) =>
        set((state) => ({
          ...state,
          user,
          isAuthenticated: true,
        })),
      setHasHydrated: (value) => set({ hasHydrated: value }),
      clearSession: () =>
        set({
          ...initialState,
          hasHydrated: true,
        }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: zustandStorage,
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenType: state.tokenType,
        expiresInSeconds: state.expiresInSeconds,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
