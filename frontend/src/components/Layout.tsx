import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { IconBox, IconLogout, IconUsers } from "./icons";
import { cores, fontStack } from "../styles/theme";

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = authService.getUsuarioLogado();

  const sair = () => {
    authService.logout();
    navigate("/login", { replace: true });
  };

  const linkAtivo = (path: string) => location.pathname === path;

  return (
    <div style={{ minHeight: "100vh", background: cores.bg, fontFamily: fontStack }}>
      <nav style={navBar}>
        <div style={navInner}>
          <div style={brand}>
            <div style={brandIcon}>
              <IconBox size={18} color={cores.card} />
            </div>
            <span style={brandText}>Gestão de Produtos</span>
          </div>

          <div style={links}>
            <Link to="/home" style={{ ...link, ...(linkAtivo("/home") ? linkAtivoStyle : {}) }}>
              Produtos
            </Link>
            <Link
              to="/usuarios"
              style={{ ...link, ...(linkAtivo("/usuarios") ? linkAtivoStyle : {}) }}
            >
              <IconUsers size={15} />
              Usuários
            </Link>
          </div>

          <div style={userArea}>
            {usuario && <span style={userName}>{usuario.nome}</span>}
            <button onClick={sair} style={btnSair} title="Sair">
              <IconLogout size={16} />
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 32px 48px" }}>
        {children}
      </main>
    </div>
  );
}

const navBar: React.CSSProperties = {
  background: cores.card,
  borderBottom: `1px solid ${cores.border}`,
};

const navInner: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 32px",
  height: "64px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "24px",
};

const brand: React.CSSProperties = { display: "flex", alignItems: "center", gap: "10px" };
const brandIcon: React.CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  background: cores.primaria,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const brandText: React.CSSProperties = { fontWeight: 700, fontSize: "0.95rem", color: cores.texto };

const links: React.CSSProperties = { display: "flex", gap: "4px", flex: 1, justifyContent: "center" };
const link: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 16px",
  borderRadius: "8px",
  fontSize: "0.88rem",
  fontWeight: 600,
  color: cores.textoSuave,
  textDecoration: "none",
};
const linkAtivoStyle: React.CSSProperties = {
  background: cores.acentoSuave,
  color: cores.acento,
};

const userArea: React.CSSProperties = { display: "flex", alignItems: "center", gap: "14px" };
const userName: React.CSSProperties = { fontSize: "0.85rem", color: cores.textoSuave, fontWeight: 500 };
const btnSair: React.CSSProperties = {
  background: "none",
  border: `1px solid ${cores.border}`,
  borderRadius: "8px",
  padding: "8px",
  display: "flex",
  cursor: "pointer",
  color: cores.textoSuave,
};
