import { useCallback } from 'react';

import { apiRequest } from '@/lib/api';
import {
  AppUser,
  AuthResponse,
  AuthSession,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  UserRole,
} from '@/interfaces';

type AuthApiPayload =
  | AuthResponse
  | (Partial<AuthResponse> & {
      token?: string;
      appUser?: AppUser;
      user?: AppUser;
    });

export function useAuthService() {
  const register = useCallback(async (payload: RegisterRequest): Promise<AuthSession> => {
    const data = await apiRequest<AuthApiPayload>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return normalizeSession(data);
  }, []);

  const login = useCallback(async (payload: LoginRequest): Promise<AuthSession> => {
    const data = await apiRequest<AuthApiPayload>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return normalizeSession(data);
  }, []);

  const refresh = useCallback(async (refreshToken: string): Promise<AuthSession> => {
    const payload: RefreshTokenRequest = { refreshToken };
    const data = await apiRequest<AuthApiPayload>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return normalizeSession(data);
  }, []);

  const getAuthenticatedUser = useCallback(async (accessToken: string): Promise<AppUser> => {
    const data = await apiRequest<AppUser>('/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return normalizeUser(data);
  }, []);

  return {
    register,
    login,
    refresh,
    getAuthenticatedUser,
  };
}

function normalizeSession(data: AuthApiPayload): AuthSession {
  const partial = normalizePartialSession(data);
  const userSource =
    typeof data === 'object' && data
      ? 'user' in data
        ? data.user
        : 'appUser' in data
        ? data.appUser
        : data
      : data;

  return {
    ...partial,
    user: normalizeUser(userSource),
  };
}

function normalizePartialSession(data: unknown) {
  if (!data || typeof data !== 'object') {
    throw new Error('Resposta de autenticação inválida.');
  }

  const accessToken =
    'accessToken' in data && typeof data.accessToken === 'string'
      ? data.accessToken
      : 'token' in data && typeof data.token === 'string'
      ? data.token
      : null;

  const refreshToken =
    'refreshToken' in data && typeof data.refreshToken === 'string' ? data.refreshToken : '';
  const tokenType =
    'tokenType' in data && typeof data.tokenType === 'string' ? data.tokenType : 'Bearer';
  const expiresInSeconds =
    'expiresInSeconds' in data &&
    (typeof data.expiresInSeconds === 'number' || typeof data.expiresInSeconds === 'string')
      ? Number(data.expiresInSeconds)
      : 0;

  if (!accessToken) {
    throw new Error('A API não retornou um access token válido.');
  }

  return {
    accessToken,
    refreshToken,
    tokenType,
    expiresInSeconds,
  };
}

function normalizeUser(data: unknown): AppUser {
  if (!data || typeof data !== 'object') {
    throw new Error('Resposta de usuário inválida.');
  }

  const id =
    'id' in data && typeof data.id === 'number'
      ? data.id
      : 'id' in data && typeof data.id === 'string'
      ? Number(data.id)
      : 0;
  const name = 'name' in data && typeof data.name === 'string' ? data.name : '';
  const email = 'email' in data && typeof data.email === 'string' ? data.email : '';
  const role = 'role' in data ? parseUserRole(data.role) : UserRole.USER;
  const createdAt =
    'createdAt' in data && typeof data.createdAt === 'string' ? data.createdAt : '';

  return {
    id,
    name,
    email,
    role,
    createdAt,
  };
}

function parseUserRole(value: unknown): UserRole {
  switch (value) {
    case UserRole.USER:
      return UserRole.USER;
    case UserRole.APPROVER:
      return UserRole.APPROVER;
    case UserRole.ADMIN:
      return UserRole.ADMIN;
    case UserRole.DEV:
      return UserRole.DEV;
    default:
      return UserRole.USER;
  }
}
