import type { AtualizarProdutoDto, CriarProdutoDto, Produto } from "../types/produto";

const BASE = "/api/produtos";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.erro ?? `Erro HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const produtoService = {
  listar: (): Promise<Produto[]> =>
    fetch(BASE).then(r => handleResponse<Produto[]>(r)),

  obter: (id: string): Promise<Produto> =>
    fetch(`${BASE}/${id}`).then(r => handleResponse<Produto>(r)),

  criar: (dto: CriarProdutoDto): Promise<Produto> =>
    fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    }).then(r => handleResponse<Produto>(r)),

  atualizar: (id: string, dto: AtualizarProdutoDto): Promise<Produto> =>
    fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    }).then(r => handleResponse<Produto>(r)),

  remover: (id: string): Promise<void> =>
    fetch(`${BASE}/${id}`, { method: "DELETE" }).then(r => handleResponse<void>(r)),
};
