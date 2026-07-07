import { useState, type FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/authService";
import { IconArrowLeft, IconEye, IconEyeOff, IconLock, IconSpinner } from "../components/icons";
import { cores, fontStack } from "../styles/theme";

export function RedefinirSenhaPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Cole o token de recuperação recebido por e-mail.");
      return;
    }
    if (!novaSenha || !confirmarNovaSenha) {
      toast.error("Preencha a nova senha e a confirmação.");
      return;
    }
    if (novaSenha !== confirmarNovaSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await authService.redefinirSenha({ token, novaSenha, confirmarNovaSenha });
      toast.success("Senha redefinida com sucesso! Faça login novamente.");
      navigate("/login", { replace: true });
    } catch (error: any) {
      toast.error(error.message ?? "Não foi possível redefinir a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <Toaster position="top-right" />
      <div style={container}>
        <div style={header}>
          <div style={logo}>
            <IconLock size={24} color={cores.card} />
          </div>
          <h1 style={titulo}>Redefinir senha</h1>
          <p style={subtitulo}>Informe o token recebido e escolha uma nova senha.</p>
        </div>

        <form onSubmit={handleSubmit} style={form}>
          <div style={campoGroup}>
            <label style={label}>Token de recuperação</label>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Cole aqui o token recebido"
              style={{ ...input, fontFamily: "monospace", fontSize: "0.78rem" }}
              disabled={loading}
            />
          </div>

          <div style={campoGroup}>
            <label style={label}>Nova senha</label>
            <div style={inputWrapper}>
              <input
                type={mostrarSenha ? "text" : "password"}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                style={input}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                style={toggleSenha}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? <IconEyeOff size={16} color={cores.textoFraco} /> : <IconEye size={16} color={cores.textoFraco} />}
              </button>
            </div>
          </div>

          <div style={campoGroup}>
            <label style={label}>Confirmar nova senha</label>
            <input
              type={mostrarSenha ? "text" : "password"}
              value={confirmarNovaSenha}
              onChange={(e) => setConfirmarNovaSenha(e.target.value)}
              placeholder="Repita a nova senha"
              style={input}
              disabled={loading}
            />
          </div>

          <p style={dica}>
            A senha deve ter ao menos 8 caracteres, com letra maiúscula, minúscula, número e
            caractere especial.
          </p>

          <button type="submit" style={btnPrimario} disabled={loading}>
            {loading ? <IconSpinner size={16} color={cores.card} /> : null}
            {loading ? "Redefinindo..." : "Redefinir senha"}
          </button>
        </form>

        <Link to="/login" style={voltar}>
          <IconArrowLeft size={15} />
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: cores.bg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  fontFamily: fontStack,
};

const container: React.CSSProperties = {
  background: cores.card,
  borderRadius: "16px",
  padding: "44px 40px",
  maxWidth: "440px",
  width: "100%",
  boxShadow: "0 4px 24px rgba(15, 23, 42, 0.06)",
  border: `1px solid ${cores.border}`,
};

const header: React.CSSProperties = { textAlign: "center", marginBottom: "28px" };
const logo: React.CSSProperties = {
  width: "52px",
  height: "52px",
  borderRadius: "14px",
  background: cores.primaria,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 16px",
};
const titulo: React.CSSProperties = { margin: 0, fontSize: "1.3rem", fontWeight: 700, color: cores.texto };
const subtitulo: React.CSSProperties = { margin: "10px 0 0", color: cores.textoSuave, fontSize: "0.86rem" };

const form: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "16px" };
const campoGroup: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "6px" };
const label: React.CSSProperties = { fontSize: "0.82rem", fontWeight: 600, color: cores.texto };
const inputWrapper: React.CSSProperties = { position: "relative", display: "flex", alignItems: "center" };
const input: React.CSSProperties = {
  width: "100%",
  padding: "11px 12px",
  borderRadius: "8px",
  border: `1.5px solid ${cores.border}`,
  fontSize: "0.92rem",
  background: cores.bg,
  outline: "none",
  fontFamily: "inherit",
};
const toggleSenha: React.CSSProperties = {
  position: "absolute",
  right: "10px",
  background: "none",
  border: "none",
  display: "flex",
  cursor: "pointer",
  padding: "4px",
};

const dica: React.CSSProperties = { fontSize: "0.78rem", color: cores.textoFraco, margin: 0, lineHeight: 1.5 };

const btnPrimario: React.CSSProperties = {
  background: cores.primaria,
  color: cores.card,
  border: "none",
  borderRadius: "8px",
  padding: "13px",
  fontWeight: 600,
  fontSize: "0.95rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};

const voltar: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  justifyContent: "center",
  marginTop: "24px",
  fontSize: "0.85rem",
  color: cores.textoSuave,
  textDecoration: "none",
};
