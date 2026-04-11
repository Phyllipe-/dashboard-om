// Helpers para chamadas autenticadas à api-om.
// Uso: import { apiFetch } from "./api.js";

const API_BASE = "http://127.0.0.1:5000/api";

/**
 * Faz uma chamada autenticada à API.
 * Lança um Error com a mensagem da API se o status não for 2xx.
 */
export async function apiFetch(path, options = {}) {
  const token = sessionStorage.getItem("om_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    sessionStorage.removeItem("om_token");
    sessionStorage.removeItem("om_user");
    window.location.href = "/login";
    throw new Error("Sessão expirada. Redirecionando para login…");
  }

  if (!response.ok) {
    throw new Error(data.erro ?? `Erro ${response.status}`);
  }

  return data;
}

// --- Alunos ---

/** GET /api/alunos/ — retorna { total, alunos[] } */
export function fetchAlunos() {
  return apiFetch("/alunos/");
}

/** POST /api/alunos/ — cadastra novo aluno */
export function cadastrarAluno(dados) {
  return apiFetch("/alunos/", { method: "POST", body: JSON.stringify(dados) });
}

/** PATCH /api/alunos/:id/ativo — alterna ativo/inativo */
export function toggleAtivoAluno(id_aluno) {
  return apiFetch(`/alunos/${id_aluno}/ativo`, { method: "PATCH" });
}

/** PATCH /api/alunos/:id/login — atualiza o login curto do aluno */
export function atualizarLoginAluno(id_aluno, login) {
  return apiFetch(`/alunos/${id_aluno}/login`, { method: "PATCH", body: JSON.stringify({ login }) });
}

/** GET /api/alunos/buscar?q=... — busca por email ou login */
export function buscarAluno(q) {
  return apiFetch(`/alunos/buscar?q=${encodeURIComponent(q)}`);
}

// --- Mapas ---

/** GET /api/treinos/mapas — todos os mapas (todos os professores) */
export function fetchTodosMaps() {
  return apiFetch("/treinos/mapas");
}

/** GET /api/treinos/mapas/meus — apenas mapas do professor logado */
export function fetchMeusMaps() {
  return apiFetch("/treinos/mapas/meus");
}

/** PATCH /api/treinos/mapas/:id/ativo — alterna ativo/inativo (somente mapa próprio) */
export function toggleAtivoMapa(id_mapa) {
  return apiFetch(`/treinos/mapas/${id_mapa}/ativo`, { method: "PATCH" });
}

// --- Professores (restrito ao id_usuario = 1) ---

/** POST /api/auth/register — cadastra novo professor */
export function cadastrarProfessor(dados) {
  return apiFetch("/auth/register", { method: "POST", body: JSON.stringify(dados) });
}

// --- Atividades ---

/** GET /api/atividades/ — lista atividades do professor logado */
export function fetchAtividades() {
  return apiFetch("/atividades/");
}

/** GET /api/atividades/:id — detalhe com mapas e alunos */
export function fetchAtividade(id) {
  return apiFetch(`/atividades/${id}`);
}

/** POST /api/atividades/ — cria nova atividade */
export function criarAtividade(dados) {
  return apiFetch("/atividades/", { method: "POST", body: JSON.stringify(dados) });
}

/** PATCH /api/atividades/:id/ativo — alterna ativo/inativo */
export function toggleAtivoAtividade(id) {
  return apiFetch(`/atividades/${id}/ativo`, { method: "PATCH" });
}

/** POST /api/treinos/mapas/:id/apropriar — copia mapa de outro professor para si */
export function apropriarMapa(id_mapa) {
  return apiFetch(`/treinos/mapas/${id_mapa}/apropriar`, { method: "POST" });
}

// --- Visualização ---

/** GET /api/alunos/:id — detalhe de um aluno */
export function fetchAluno(id) {
  return apiFetch(`/alunos/${id}`);
}

/** PATCH /api/alunos/:id — edita dados do aluno */
export function editarAluno(id, dados) {
  return apiFetch(`/alunos/${id}`, { method: "PATCH", body: JSON.stringify(dados) });
}

// --- Professores (restrito ao id_usuario = 1) ---

/** GET /api/professores/ — lista todos os professores */
export function fetchProfessores() {
  return apiFetch("/professores/");
}

/** GET /api/professores/:id — detalhe de um professor */
export function fetchProfessor(id) {
  return apiFetch(`/professores/${id}`);
}

/** PATCH /api/professores/:id — edita dados do professor */
export function editarProfessor(id, dados) {
  return apiFetch(`/professores/${id}`, { method: "PATCH", body: JSON.stringify(dados) });
}

/** PATCH /api/professores/:id/ativo — alterna ativo/inativo */
export function toggleAtivoProfessor(id) {
  return apiFetch(`/professores/${id}/ativo`, { method: "PATCH" });
}

/** GET /api/treinos/sessoes?id_aluno=X — sessões de um aluno */
export function fetchSessoes(id_aluno) {
  return apiFetch(`/treinos/sessoes?id_aluno=${id_aluno}`);
}

/** GET /api/treinos/sessoes/:id_log — detalhe de uma sessão */
export function fetchSessao(id_log) {
  return apiFetch(`/treinos/sessoes/${id_log}`);
}

/** GET /api/analises/sessao/:id_log — caminhos dos arquivos de análise */
export function fetchAnalises(id_log) {
  return apiFetch(`/analises/sessao/${id_log}`);
}

/** GET /api/analises/sessao/:id_log/metricas — Precisão, Objetivos e Fluidez calculados */
export function fetchMetricas(id_log) {
  return apiFetch(`/analises/sessao/${id_log}/metricas`);
}

/** GET /api/analises/aluno/:id/metricas — média de todas as sessões do aluno */
export function fetchMetricasAluno(id_aluno) {
  return apiFetch(`/analises/aluno/${id_aluno}/metricas`);
}
