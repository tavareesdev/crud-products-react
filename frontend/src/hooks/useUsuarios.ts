import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usuarioService } from "../services/usuarioService";
import type { AtualizarUsuarioDto, CriarUsuarioDto, Usuario, AtualizarSenhaDto } from "../types/usuario";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await usuarioService.listar();
      setUsuarios(data);
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao carregar usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const criar = async (dto: CriarUsuarioDto) => {
    const novo = await usuarioService.criar(dto);
    setUsuarios(prev => [novo, ...prev]);
    toast.success("Usuario criado com sucesso!");
    return novo;
  };

  const atualizar = async (id: string, dto: AtualizarUsuarioDto) => {
    const atualizado = await usuarioService.atualizar(id, dto);
    setUsuarios(prev => prev.map(p => p.id === id ? atualizado : p));
    toast.success("Usuario atualizado!");
    return atualizado;
  };

  const remover = async (id: string) => {
    await usuarioService.remover(id);
    setUsuarios(prev => prev.filter(p => p.id !== id));
    toast.success("Usuario removido.");
  };

  const atualizarSenha = async (id: string, dto: AtualizarSenhaDto) => {
    const atualizado = await usuarioService.atualizarSenha(id, dto);
    setUsuarios(prev => prev.map(p => p.id === id ? atualizado : p));
    toast.success("Senha atualizada!");
    return atualizado;
  };

  return { usuarios, loading, carregar, criar, atualizar, remover, atualizarSenha };
}
