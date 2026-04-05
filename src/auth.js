// Módulo de autenticação — gerencia token JWT no sessionStorage.
// Importar em qualquer página protegida com: import { requireAuth, getToken, logout } from "./auth.js";

const API_BASE = "http://127.0.0.1:5000/api";
const TOKEN_KEY = "om_token";
const USER_KEY  = "om_user";

/** Retorna o token JWT armazenado, ou null se não houver. */
export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

/** Retorna o objeto { id_usuario, nome, id_tipo } do usuário logado, ou null. */
export function getUser() {
  const raw = sessionStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

/** Salva token e dados do usuário após login bem-sucedido. */
export function saveSession(token, usuario) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(usuario));
}

/** Remove a sessão e redireciona para o login. */
export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  window.location.href = "/login";
}

/**
 * Verifica se há sessão ativa.
 * Se não houver, redireciona para /login e lança um erro para interromper a execução da página.
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
