const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function request<T = any>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error(json.error || 'Sesión expirada');
  }

  if (!res.ok) throw new Error(json.error || 'Error en la solicitud');
  return json;
}

export const api = {
  get: <T = any>(path: string) => request<T>('GET', path), // eslint-disable-line @typescript-eslint/no-explicit-any
  post: <T = any>(path: string, body?: unknown) => request<T>('POST', path, body), // eslint-disable-line @typescript-eslint/no-explicit-any
  put: <T = any>(path: string, body?: unknown) => request<T>('PUT', path, body), // eslint-disable-line @typescript-eslint/no-explicit-any
  patch: <T = any>(path: string, body?: unknown) => request<T>('PATCH', path, body), // eslint-disable-line @typescript-eslint/no-explicit-any
  del: <T = any>(path: string) => request<T>('DELETE', path), // eslint-disable-line @typescript-eslint/no-explicit-any
};
