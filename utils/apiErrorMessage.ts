const DEFAULT_ERROR_MESSAGE = 'Erro inesperado.';
const OFFLINE_CACHE_MESSAGE =
  'Não foi possível se conectar ao servidor. Mostrando o conteúdo baixado anteriormente.';

const SENSITIVE_KEY_PATTERN =
  /(["']?(?:authorization|password|senha|token|accessToken|refreshToken|api[_-]?key|secret|client_secret)["']?\s*[:=]\s*["']?)([^"',\s}]+)/gi;

export function sanitizeApiErrorMessage(message: unknown) {
  if (typeof message !== 'string') {
    return DEFAULT_ERROR_MESSAGE;
  }

  const sanitized = message
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+at\s+[\w.$<>\s]+\(.*?\)/g, ' ')
    .replace(SENSITIVE_KEY_PATTERN, '$1[oculto]')
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi, 'Bearer [oculto]')
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, '[token oculto]')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email oculto]')
    .replace(/https?:\/\/[^\s?#]+(?:[?#][^\s]*)?/gi, (url) => url.split(/[?#]/)[0])
    .replace(/\b[A-Za-z0-9_-]{48,}\b/g, '[oculto]')
    .replace(/\s+/g, ' ')
    .trim();

  if (!sanitized) {
    return DEFAULT_ERROR_MESSAGE;
  }

  return sanitized.length > 220 ? `${sanitized.slice(0, 217)}...` : sanitized;
}

export function getSafeErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return sanitizeApiErrorMessage(error.message);
  }

  return sanitizeApiErrorMessage(error);
}

export function buildOfflineCacheMessage(error: unknown) {
  return `${OFFLINE_CACHE_MESSAGE} Mensagem da API: ${getSafeErrorMessage(error)}`;
}
