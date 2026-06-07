// Cliente HTTP central: añade la URL base y el token JWT a cada petición,
// y cierra la sesión automáticamente si el token caduca (401).

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const getToken = () => localStorage.getItem("invoice_token");
export const getUsername = () => localStorage.getItem("invoice_user");

export function setSession(token, username) {
  localStorage.setItem("invoice_token", token);
  localStorage.setItem("invoice_user", username);
}

export function logout() {
  localStorage.removeItem("invoice_token");
  localStorage.removeItem("invoice_user");
  window.location.reload();
}

export async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(BASE + path, { ...options, headers });

  // Solo cerramos sesión si HABÍA token (sesión caducada). En el login no hay
  // token todavía, así que un 401 ahí lo gestiona la propia pantalla de login.
  if (res.status === 401 && token) {
    localStorage.removeItem("invoice_token");
    localStorage.removeItem("invoice_user");
    window.location.reload();
  }
  return res;
}
