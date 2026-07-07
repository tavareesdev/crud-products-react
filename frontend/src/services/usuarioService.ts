import type { AtualizarUsuarioDto, CriarUsuarioDto, Usuario, AtualizarSenhaDto } from "../types/usuario";

const BASE = "/api/usuarios";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.erro ?? `Erro HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const usuarioService = {
  listar: (): Promise<Usuario[]> =>
    fetch(BASE).then(r => handleResponse<Usuario[]>(r)),

  obter: (id: string): Promise<Usuario> =>
    fetch(`${BASE}/${id}`).then(r => handleResponse<Usuario>(r)),

  criar: (dto: CriarUsuarioDto): Promise<Usuario> =>
    fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    }).then(r => handleResponse<Usuario>(r)),

  atualizar: (id: string, dto: AtualizarUsuarioDto): Promise<Usuario> =>
    fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    }).then(r => handleResponse<Usuario>(r)),

  remover: (id: string): Promise<void> =>
    fetch(`${BASE}/${id}`, { method: "DELETE" }).then(r => handleResponse<void>(r)),

  atualizarSenha: (id: string, dto: AtualizarSenhaDto): Promise<Usuario> =>
    fetch(`${BASE}/${id}/senha`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    }).then(r => handleResponse<Usuario>(r)),
};
