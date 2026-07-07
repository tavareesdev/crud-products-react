import type { Usuario } from "../types/usuario";
import { IconEdit, IconTrash, IconUsers } from "./icons";
import { cores } from "../styles/theme";

interface Props {
  usuarios: Usuario[];
  onEditar: (u: Usuario) => void;
  onAlterarSenha: (u: Usuario) => void;
  onRemover: (id: string) => void;
}

function formatarCpf(cpf: string) {
  const digitos = cpf.replace(/\D/g, "");
  if (digitos.length !== 11) return cpf;
  return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function UsuarioTabela({ usuarios, onEditar, onAlterarSenha, onRemover }: Props) {
  if (usuarios.length === 0) {
    return (
      <div style={empty}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <IconUsers size={40} color={cores.textoFraco} />
        </div>
        <p style={{ color: cores.textoFraco, margin: "12px 0 0" }}>Nenhum usuário cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto", borderRadius: "12px", border: `1px solid ${cores.border}` }}>
      <table style={tabela}>
        <thead>
          <tr style={{ background: cores.bg }}>
            {["Nome", "E-mail", "CPF", "Status", "Criado em", "Ações"].map((h) => (
              <th key={h} style={th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u, i) => (
            <tr key={u.id} style={{ background: i % 2 === 0 ? cores.card : "#fafafa" }}>
              <td style={{ ...td, fontWeight: 500 }}>{u.nome}</td>
              <td style={td}>{u.email}</td>
              <td style={td}><span style={badge}>{formatarCpf(u.documento)}</span></td>
              <td style={td}>
                <span style={{
                  padding: "2px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600,
                  background: u.ativo ? cores.sucessoBg : cores.erroBg,
                  color: u.ativo ? cores.sucessoTexto : cores.erroTexto
                }}>
                  {u.ativo ? "Ativo" : "Inativo"}
                </span>
              </td>
              <td style={{ ...td, color: cores.textoSuave, fontSize: "0.82rem" }}>
                {new Date(u.criadoEm).toLocaleDateString("pt-BR")}
              </td>
              <td style={{ ...td, whiteSpace: "nowrap" }}>
                <button onClick={() => onAlterarSenha(u)} style={btnTexto} title="Alterar senha">
                  Senha
                </button>
                <button onClick={() => onEditar(u)} style={btn} title="Editar">
                  <IconEdit size={15} color={cores.textoSuave} />
                </button>
                <button onClick={() => {
                  if (confirm(`Remover "${u.nome}"?`)) onRemover(u.id);
                }} style={btn} title="Remover">
                  <IconTrash size={15} color={cores.erro} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const empty: React.CSSProperties = {
  textAlign: "center", padding: "60px 20px",
  border: `2px dashed ${cores.border}`, borderRadius: "12px"
};
const tabela: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" };
const th: React.CSSProperties = {
  padding: "12px 16px", textAlign: "left", fontWeight: 600,
  color: cores.textoSuave, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em"
};
const td: React.CSSProperties = { padding: "12px 16px", color: "#374151", verticalAlign: "middle" };
const badge: React.CSSProperties = {
  background: cores.acentoSuave, color: "#3730a3", padding: "2px 8px",
  borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, fontFamily: "monospace"
};
const btn: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer", padding: "6px", borderRadius: "6px",
  display: "inline-flex", alignItems: "center"
};
const btnTexto: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer", padding: "6px 8px", borderRadius: "6px",
  fontSize: "0.78rem", fontWeight: 600, color: cores.acento
};
