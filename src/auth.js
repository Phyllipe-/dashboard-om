// Módulo de autenticação — gerencia token JWT no sessionStorage.
// Importar em qualquer página protegida com: import { requireAuth, getToken, logout } from "./auth.js";

const API_BASE = "http://127.0.0.1:5000/api";
const TOKEN_KEY      = "om_token";
const USER_KEY       = "om_user";
const LOGIN_TIME_KEY = "om_login_time";

// Tempo máximo de sessão: 4 horas a partir do login
const SESSION_EXPIRY_MS = 4 * 60 * 60 * 1000;

/** Retorna o token JWT armazenado, ou null se não houver. */
export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

/** Retorna o objeto { id_usuario, nome, id_tipo } do usuário logado, ou null. */
export function getUser() {
  const raw = sessionStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

/** Retorna true se a sessão ainda está dentro do prazo de 4 horas. */
export function isSessionValid() {
  let loginTime = sessionStorage.getItem(LOGIN_TIME_KEY);
  // Sessão legada (sem loginTime): adota o momento atual como início
  // para não deslogar o usuário de forma inesperada.
  if (!loginTime) {
    loginTime = Date.now().toString();
    sessionStorage.setItem(LOGIN_TIME_KEY, loginTime);
  }
  return (Date.now() - parseInt(loginTime, 10)) < SESSION_EXPIRY_MS;
}

/** Salva token, dados do usuário e o instante do login. */
export function saveSession(token, usuario) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(usuario));
  sessionStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());
}

/** Remove a sessão e redireciona para o login. */
export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(LOGIN_TIME_KEY);
  window.location.href = "/login";
}

/**
 * Verifica se há sessão ativa e se ainda está dentro do prazo de 4 horas.
 * Se não houver ou estiver expirada, redireciona para /login.
 * Usar no topo de páginas protegidas:
 *   const user = requireAuth();
 */
export function requireAuth() {
  const token = getToken();
  const user  = getUser();
  if (!token || !user) {
    window.location.href = "/login";
    throw new Error("Não autenticado — redirecionando para login.");
  }
  if (!isSessionValid()) {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(LOGIN_TIME_KEY);
    window.location.href = "/login?expirado=1";
    throw new Error("Sessão expirada após 4 horas — redirecionando para login.");
  }
  return user;
}

/**
 * Faz login na api-om.
 * @returns {Promise<{token: string, usuario: object}>}
 * @throws {Error} com mensagem da API em caso de falha
 */
export async function login(email, senha) {
  const form = new FormData();
  form.append("email", email);
  form.append("senha", senha);

  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    body: form,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro ?? "Erro ao conectar com a API.");
  }

  return data; // { token, usuario: { id_usuario, nome, id_tipo } }
}
