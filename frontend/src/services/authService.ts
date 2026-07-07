import type {
  EsqueciSenhaDto,
  EsqueciSenhaResponse,
  LoginDto,
  LoginResponse,
  RedefinirSenhaDto,
} from "../types/auth";
import type { Usuario } from "../types/usuario";

const BASE = "/api/auth";
const TOKEN_KEY = "auth_token";
const USUARIO_KEY = "auth_usuario";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.erro ?? `Erro HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const authService = {
  login: (dto: LoginDto): Promise<LoginResponse> =>
    fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    }).then((r) => handleResponse<LoginResponse>(r)),

  esqueciSenha: (dto: EsqueciSenhaDto): Promise<EsqueciSenhaResponse> =>
    fetch(`${BASE}/esqueci-senha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    }).then((r) => handleResponse<EsqueciSenhaResponse>(r)),

  redefinirSenha: (dto: RedefinirSenhaDto): Promise<void> =>
    fetch(`${BASE}/redefinir-senha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    }).then((r) => handleResponse<void>(r)),

  salvarSessao(token: string, usuario: Usuario) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUsuarioLogado(): Usuario | null {
    const raw = localStorage.getItem(USUARIO_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      return null;
    }
  },

  estaAutenticado(): boolean {
    return !!authService.getToken();
  },
};
