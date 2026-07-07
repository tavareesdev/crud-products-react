import { useEffect, useState } from "react";
import type { AtualizarUsuarioDto, CriarUsuarioDto, Usuario } from "../types/usuario";
import { cores } from "../styles/theme";

interface Props {
  usuario?: Usuario | null;
  onSalvar: (dto: CriarUsuarioDto | AtualizarUsuarioDto) => Promise<void>;
  onFechar: () => void;
}

const VAZIO = { nome: "", email: "", documento: "", senha: "" };

function formatarCpf(valor: string) {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);
  return digitos
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function UsuarioModal({ usuario, onSalvar, onFechar }: Props) {
  const [form, setForm] = useState({ ...VAZIO });
  const [salvando, setSalvando] = useState(false);
  const editando = !!usuario;

  useEffect(() => {
    if (usuario) {
      setForm({
        nome: usuario.nome,
        email: usuario.email,
        documento: formatarCpf(usuario.documento),
        senha: "",
      });
    } else {
      setForm({ ...VAZIO });
    }
  }, [usuario]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const documentoLimpo = form.documento.replace(/\D/g, "");
      if (editando) {
        await onSalvar({ nome: form.nome, email: form.email, documento: documentoLimpo });
      } else {
        await onSalvar({ nome: form.nome, email: form.email, documento: documentoLimpo, senha: form.senha });
      }
      onFechar();
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={modalHeader}>
          <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: cores.texto }}>
            {editando ? "Editar usuário" : "Novo usuário"}
          </h2>
          <button onClick={onFechar} style={btnClose}>✕</button>
        </div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={field}>
            <label style={label}>Nome completo *</label>
            <input
              style={inp}
              required
              value={form.nome}
              onChange={(e) => set("nome", e.target.value)}
              placeholder="Ex: Maria da Silva"
            />
          </div>

          <div style={row}>
            <div style={field}>
              <label style={label}>E-mail *</label>
              <input
                style={inp}
                type="email"
                required
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="nome@empresa.com"
              />
            </div>
            <div style={{ ...field, flex: "0 0 170px" }}>
              <label style={label}>CPF *</label>
              <input
                style={inp}
                required
                value={form.documento}
                onChange={(e) => set("documento", formatarCpf(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>
          </div>

          {!editando && (
            <div style={field}>
              <label style={label}>Senha *</label>
              <input
                style={inp}
                type="password"
                required
                value={form.senha}
                onChange={(e) => set("senha", e.target.value)}
                placeholder="Mínimo 8 caracteres"
              />
              <span style={dica}>
                Deve conter maiúscula, minúscula, número e caractere especial.
              </span>
            </div>
          )}

          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "8px" }}>
            <button type="button" onClick={onFechar} style={btnSec}>Cancelar</button>
            <button type="submit" disabled={salvando} style={btnPri}>
              {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Criar usuário"}
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
  width: "min(540px, 95vw)", boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
  maxHeight: "90vh", overflowY: "auto"
};
const modalHeader: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"
};
const row: React.CSSProperties = { display: "flex", gap: "12px" };
const field: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "4px", flex: 1 };
const label: React.CSSProperties = { fontSize: "0.8rem", fontWeight: 600, color: cores.textoSuave };
const dica: React.CSSProperties = { fontSize: "0.72rem", color: cores.textoFraco };
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
