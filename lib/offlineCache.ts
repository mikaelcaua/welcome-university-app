import { storage } from './storage';
import { showToast } from './toast';
import { buildOfflineCacheMessage, getSafeErrorMessage } from '@/utils/apiErrorMessage';

const CACHE_PREFIX = 'welcome-university.cache';

export const CACHE_KEYS = {
  states: `${CACHE_PREFIX}.states`,
  profile: `${CACHE_PREFIX}.profile`,
  universitiesByState: (stateId: number) => `${CACHE_PREFIX}.states.${stateId}.universities`,
  coursesByUniversity: (universityId: number) =>
    `${CACHE_PREFIX}.universities.${universityId}.courses`,
  subjectsByCourse: (courseId: number) => `${CACHE_PREFIX}.courses.${courseId}.subjects`,
  examsBySubject: (subjectId: number) => `${CACHE_PREFIX}.subjects.${subjectId}.exams`,
  currentPendingExams: `${CACHE_PREFIX}.users.me.pending-exams`,
  pendingReviewExams: (filters: {
    stateId: number;
    universityId: number;
    courseId: number;
    subjectId: number;
  }) =>
    `${CACHE_PREFIX}.review.pending.${filters.stateId}.${filters.universityId}.${filters.courseId}.${filters.subjectId}`,
};

const USER_SCOPED_CACHE_KEYS = [
  CACHE_KEYS.profile,
  CACHE_KEYS.currentPendingExams,
];

const USER_SCOPED_CACHE_PREFIXES = [
  `${CACHE_PREFIX}.review.pending.`,
];

interface CacheEnvelope<T> {
  savedAt: string;
  data: T;
}

interface CachedRequestOptions<T> {
  cacheKey: string;
  request: () => Promise<T>;
  alertTitle: string;
  fallbackMessage?: string;
}

export async function readCache<T>(cacheKey: string): Promise<T | null> {
  const raw = await storage.getItem(cacheKey);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as CacheEnvelope<T>;
    return parsed.data;
  } catch {
    await storage.removeItem(cacheKey);
    return null;
  }
}

export async function writeCache<T>(cacheKey: string, data: T) {
  const envelope: CacheEnvelope<T> = {
    savedAt: new Date().toISOString(),
    data,
  };

  await storage.setItem(cacheKey, JSON.stringify(envelope));
}

export async function clearUserScopedCache() {
  const keys = await storage.getAllKeys();
  const cacheKeys = keys.filter(
    (key) =>
      USER_SCOPED_CACHE_KEYS.includes(key) ||
      USER_SCOPED_CACHE_PREFIXES.some((prefix) => key.startsWith(prefix)),
  );

  if (cacheKeys.length > 0) {
    await storage.multiRemove(cacheKeys);
  }
}

export async function getCachedOrFetch<T>({
  cacheKey,
  request,
  alertTitle,
  fallbackMessage,
}: CachedRequestOptions<T>): Promise<T> {
  try {
    const data = await request();
    await writeCache(cacheKey, data);
    return data;
  } catch (error) {
    const cached = await readCache<T>(cacheKey);

    if (cached !== null) {
      showToast({
        title: alertTitle,
        message: fallbackMessage
          ? `${fallbackMessage} Mensagem da API: ${getErrorMessage(error)}`
          : buildOfflineCacheMessage(error),
        variant: 'warning',
      });
      return cached;
    }

    throw error;
  }
}

export function getErrorMessage(error: unknown) {
  return getSafeErrorMessage(error);
}
