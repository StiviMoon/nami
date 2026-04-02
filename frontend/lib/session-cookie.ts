/**
 * Cookie en el dominio del front para que middleware.ts permita /dashboard, /pending, /super-admin.
 * El Set-Cookie del API (Render) es otro host y no aplica aquí.
 */
const NAME = 'token';
const MAX_AGE_SEC = 7 * 24 * 60 * 60;

export function setTokenCookie(token: string): void {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:';
  let v = `${NAME}=${token}; Path=/; Max-Age=${MAX_AGE_SEC}; SameSite=Lax`;
  if (secure) v += '; Secure';
  document.cookie = v;
}

export function clearTokenCookie(): void {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:';
  let v = `${NAME}=; Path=/; Max-Age=0`;
  if (secure) v += '; Secure';
  document.cookie = v;
}
