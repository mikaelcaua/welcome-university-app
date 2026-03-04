import { create } from 'zustand';

import { AppUser, AuthSession } from '@/interfaces';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  expiresInSeconds: number | null;
  user: AppUser | null;
  isAuthenticated: boolean;
  setSession: (session: AuthSession) => void;
  setUser: (user: AppUser) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  tokenType: null,
  expiresInSeconds: null,
  user: null,
  isAuthenticated: false,
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
  clearSession: () =>
    set({
      accessToken: null,
      refreshToken: null,
      tokenType: null,
      expiresInSeconds: null,
      user: null,
      isAuthenticated: false,
    }),
}));
