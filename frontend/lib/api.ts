const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T = any>(method: string, path: string, body?: any): Promise<T> {
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
    // Token expirado — limpiar y redirigir al login
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
  get: <T = any>(path: string) => request<T>('GET', path),
  post: <T = any>(path: string, body?: any) => request<T>('POST', path, body),
  put: <T = any>(path: string, body?: any) => request<T>('PUT', path, body),
  patch: <T = any>(path: string, body?: any) => request<T>('PATCH', path, body),
  del: <T = any>(path: string) => request<T>('DELETE', path),
};
