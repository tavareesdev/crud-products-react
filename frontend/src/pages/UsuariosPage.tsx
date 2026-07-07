import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Layout } from "../components/Layout";
import { UsuarioModal } from "../components/UsuarioModal";
import { UsuarioTabela } from "../components/UsuarioTabela";
import { AlterarSenhaModal } from "../components/AlterarSenhaModal";
import { IconPlus, IconSearch } from "../components/icons";
import { useUsuarios } from "../hooks/useUsuarios";
import { cores } from "../styles/theme";
import type { Usuario } from "../types/usuario";

export function UsuariosPage() {
  const { usuarios, loading, criar, atualizar, remover, atualizarSenha } = useUsuarios();
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [usuarioSenha, setUsuarioSenha] = useState<Usuario | null>(null);
  const [busca, setBusca] = useState("");

  const usuariosFiltrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(busca.toLowerCase()) ||
    u.email.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirNovo = () => { setUsuarioEditando(null); setModalAberto(true); };
  const abrirEditar = (u: Usuario) => { setUsuarioEditando(u); setModalAberto(true); };
  const fechar = () => { setModalAberto(false); setUsuarioEditando(null); };

  const onSalvar = async (dto: any) => {
    if (usuarioEditando) await atualizar(usuarioEditando.id, dto);
    else await criar(dto);
  };

  return (
    <Layout>
      <Toaster position="top-right" />
      <header style={header}>
        <div>
          <h1 style={titulo}>Usuários</h1>
          <p style={subtitulo}>Gerencie as contas que têm acesso ao sistema</p>
        </div>
        <button onClick={abrirNovo} style={btnNovo}>
          <IconPlus size={16} />
          Novo usuário
        </button>
      </header>

      <div style={toolbar}>
        <div style={searchWrapper}>
          <span style={searchIcon}><IconSearch size={16} color={cores.textoFraco} /></span>
          <input
            style={searchInp}
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
          />
        </div>
        <span style={{ color: cores.textoFraco, fontSize: "0.85rem", whiteSpace: "nowrap" }}>
          {usuariosFiltrados.length} usuário{usuariosFiltrados.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: cores.textoFraco }}>Carregando...</div>
      ) : (
        <UsuarioTabela
          usuarios={usuariosFiltrados}
          onEditar={abrirEditar}
          onAlterarSenha={setUsuarioSenha}
          onRemover={id => remover(id).catch(e => toast.error(e.message))}
        />
      )}

      {modalAberto && (
        <UsuarioModal usuario={usuarioEditando} onSalvar={onSalvar} onFechar={fechar} />
      )}

      {usuarioSenha && (
        <AlterarSenhaModal
          usuario={usuarioSenha}
          onSalvar={(dto) => atualizarSenha(usuarioSenha.id, dto)}
          onFechar={() => setUsuarioSenha(null)}
        />
      )}
    </Layout>
  );
}

const header: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
  marginBottom: "28px", flexWrap: "wrap", gap: "16px"
};
const titulo: React.CSSProperties = { margin: 0, fontSize: "1.6rem", fontWeight: 700, color: cores.texto, letterSpacing: "-0.01em" };
const subtitulo: React.CSSProperties = { margin: "4px 0 0", color: cores.textoSuave, fontSize: "0.85rem" };
const btnNovo: React.CSSProperties = {
  background: cores.primaria, color: cores.card, border: "none",
  borderRadius: "8px", padding: "11px 20px", fontWeight: 600,
  fontSize: "0.9rem", cursor: "pointer", whiteSpace: "nowrap",
  display: "flex", alignItems: "center", gap: "8px"
};
const toolbar: React.CSSProperties = {
  display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px"
};
const searchWrapper: React.CSSProperties = { position: "relative", flex: 1, display: "flex", alignItems: "center" };
const searchIcon: React.CSSProperties = { position: "absolute", left: "14px", display: "flex" };
const searchInp: React.CSSProperties = {
  width: "100%", padding: "10px 16px 10px 38px", borderRadius: "8px",
  border: `1.5px solid ${cores.border}`, fontSize: "0.9rem",
  background: cores.card, outline: "none", fontFamily: "inherit"
};
