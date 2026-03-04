const API_PORT = 8081;
const API_HOST = "mikael-dev";

export const API_URL = `http://${API_HOST}:${API_PORT}`;

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const isFormData = typeof FormData !== 'undefined' && init.body instanceof FormData;

  if (init.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  const rawBody = await response.text();
  const data = rawBody ? safeJsonParse(rawBody) : null;

  if (!response.ok) {
    throw new Error(extractApiErrorMessage(data, rawBody));
  }

  return data as T;
}

function safeJsonParse(rawBody: string) {
  try {
    return JSON.parse(rawBody);
  } catch {
    return rawBody;
  }
}

function extractApiErrorMessage(data: unknown, fallback: string) {
  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  if (data && typeof data === 'object') {
    const errorMessage =
      'message' in data && typeof data.message === 'string'
        ? data.message
        : 'error' in data && typeof data.error === 'string'
        ? data.error
        : null;

    if (errorMessage) {
      return errorMessage;
    }
  }

  return fallback || 'Não foi possível concluir a requisição.';
}
