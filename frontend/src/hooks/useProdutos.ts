import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { produtoService } from "../services/produtoService";
import type { AtualizarProdutoDto, CriarProdutoDto, Produto } from "../types/produto";

export function useProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await produtoService.listar();
      setProdutos(data);
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const criar = async (dto: CriarProdutoDto) => {
    const novo = await produtoService.criar(dto);
    setProdutos(prev => [novo, ...prev]);
    toast.success("Produto criado com sucesso!");
    return novo;
  };

  const atualizar = async (id: string, dto: AtualizarProdutoDto) => {
    const atualizado = await produtoService.atualizar(id, dto);
    setProdutos(prev => prev.map(p => p.id === id ? atualizado : p));
    toast.success("Produto atualizado!");
    return atualizado;
  };

  const remover = async (id: string) => {
    await produtoService.remover(id);
    setProdutos(prev => prev.filter(p => p.id !== id));
    toast.success("Produto removido.");
  };

  return { produtos, loading, carregar, criar, atualizar, remover };
}
