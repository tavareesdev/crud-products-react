import { useState, type FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { IconArrowLeft, IconLock, IconMail, IconSpinner } from "../components/icons";
import { cores, fontStack } from "../styles/theme";

export function EsqueciSenhaPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [tokenDev, setTokenDev] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Informe seu e-mail.");
      return;
    }

    setLoading(true);
    try {
      const resposta = await authService.esqueciSenha({ email });
      setEnviado(true);
      setTokenDev(resposta.tokenDev ?? null);
    } catch (error: any) {
      toast.error(error.message ?? "Não foi possível processar sua solicitação.");
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
          <h1 style={titulo}>Recuperar senha</h1>
          <p style={subtitulo}>
            Informe o e-mail da sua conta e enviaremos as instruções para redefinir a senha.
          </p>
        </div>

        {!enviado ? (
          <form onSubmit={handleSubmit} style={form}>
            <div style={campoGroup}>
              <label style={label}>E-mail</label>
              <div style={inputWrapper}>
                <span style={inputIcon}>
                  <IconMail size={16} color={cores.textoFraco} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  style={input}
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" style={btnPrimario} disabled={loading}>
              {loading ? <IconSpinner size={16} color={cores.card} /> : null}
              {loading ? "Enviando..." : "Enviar instruções"}
            </button>
          </form>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={aviso}>
              Se o e-mail informado estiver cadastrado, você receberá as instruções para
              redefinir sua senha em instantes.
            </div>

            {tokenDev && (
              <div style={devBox}>
                <strong style={{ display: "block", marginBottom: "6px" }}>
                  Modo desenvolvimento
                </strong>
                Este projeto ainda não tem um serviço de e-mail configurado, então o token de
                redefinição é exibido aqui apenas para você testar o fluxo:
                <div style={tokenText}>{tokenDev}</div>
                <button
                  type="button"
                  style={btnLinkToken}
                  onClick={() => navigate(`/redefinir-senha?token=${encodeURIComponent(tokenDev)}`)}
                >
                  Usar este token agora →
                </button>
              </div>
            )}
          </div>
        )}

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
const subtitulo: React.CSSProperties = {
  margin: "10px 0 0",
  color: cores.textoSuave,
  fontSize: "0.86rem",
  lineHeight: 1.5,
};

const form: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "18px" };
const campoGroup: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "6px" };
const label: React.CSSProperties = { fontSize: "0.82rem", fontWeight: 600, color: cores.texto };
const inputWrapper: React.CSSProperties = { position: "relative", display: "flex", alignItems: "center" };
const inputIcon: React.CSSProperties = { position: "absolute", left: "12px", display: "flex" };
const input: React.CSSProperties = {
  width: "100%",
  padding: "11px 12px 11px 38px",
  borderRadius: "8px",
  border: `1.5px solid ${cores.border}`,
  fontSize: "0.92rem",
  background: cores.bg,
  outline: "none",
  fontFamily: "inherit",
};

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

const aviso: React.CSSProperties = {
  background: cores.acentoSuave,
  color: cores.acento,
  padding: "14px 16px",
  borderRadius: "8px",
  fontSize: "0.85rem",
  lineHeight: 1.5,
};

const devBox: React.CSSProperties = {
  background: "#fffbeb",
  border: "1px solid #fde68a",
  color: "#92400e",
  padding: "14px 16px",
  borderRadius: "8px",
  fontSize: "0.82rem",
  lineHeight: 1.5,
};

const tokenText: React.CSSProperties = {
  marginTop: "8px",
  padding: "8px 10px",
  background: "#fff",
  border: "1px solid #fde68a",
  borderRadius: "6px",
  fontFamily: "monospace",
  fontSize: "0.72rem",
  wordBreak: "break-all",
};

const btnLinkToken: React.CSSProperties = {
  marginTop: "10px",
  background: "none",
  border: "none",
  color: "#92400e",
  fontWeight: 700,
  fontSize: "0.8rem",
  cursor: "pointer",
  padding: 0,
  textDecoration: "underline",
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
