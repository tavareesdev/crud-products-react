import { useState } from "react";
import type { AtualizarSenhaDto, Usuario } from "../types/usuario";
import { cores } from "../styles/theme";

interface Props {
  usuario: Usuario;
  onSalvar: (dto: AtualizarSenhaDto) => Promise<void>;
  onFechar: () => void;
}

export function AlterarSenhaModal({ usuario, onSalvar, onFechar }: Props) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [salvando, setSalvando] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await onSalvar({ senhaAtual, novaSenha, confirmarNovaSenha });
      onFechar();
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={modalHeader}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: cores.texto }}>
              Alterar senha
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: cores.textoSuave }}>
              {usuario.nome}
            </p>
          </div>
          <button onClick={onFechar} style={btnClose}>✕</button>
        </div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={field}>
            <label style={label}>Senha atual *</label>
            <input style={inp} type="password" required value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)} />
          </div>
          <div style={field}>
            <label style={label}>Nova senha *</label>
            <input style={inp} type="password" required value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)} placeholder="Mínimo 8 caracteres" />
          </div>
          <div style={field}>
            <label style={label}>Confirmar nova senha *</label>
            <input style={inp} type="password" required value={confirmarNovaSenha}
              onChange={(e) => setConfirmarNovaSenha(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "8px" }}>
            <button type="button" onClick={onFechar} style={btnSec}>Cancelar</button>
            <button type="submit" disabled={salvando} style={btnPri}>
              {salvando ? "Salvando..." : "Alterar senha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(15,23,42,0.7)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000, backdropFilter: "blur(4px)"
};
const modal: React.CSSProperties = {
  background: cores.card, borderRadius: "16px", padding: "28px",
  width: "min(440px, 95vw)", boxShadow: "0 24px 60px rgba(0,0,0,0.2)"
};
const modalHeader: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px"
};
const field: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "4px" };
const label: React.CSSProperties = { fontSize: "0.8rem", fontWeight: 600, color: cores.textoSuave };
const inp: React.CSSProperties = {
  padding: "9px 12px", borderRadius: "8px", border: `1.5px solid ${cores.border}`,
  fontSize: "0.9rem", outline: "none", fontFamily: "inherit"
};
const btnClose: React.CSSProperties = {
  background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: cores.textoFraco, padding: "4px 8px", lineHeight: 1
};
const btnPri: React.CSSProperties = {
  background: cores.primaria, color: "#fff", border: "none",
  borderRadius: "8px", padding: "10px 22px", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer"
};
const btnSec: React.CSSProperties = {
  background: "#f1f5f9", color: cores.textoSuave, border: "none",
  borderRadius: "8px", padding: "10px 22px", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer"
};
