import { useEffect, useState, type FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { IconBox, IconEye, IconEyeOff, IconLock, IconMail, IconSpinner } from "../components/icons";
import { cores, fontStack } from "../styles/theme";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [inputFocus, setInputFocus] = useState<{ email: boolean; senha: boolean }>({
    email: false,
    senha: false,
  });

  // Se já estiver logado, redireciona para home
  useEffect(() => {
    if (authService.estaAutenticado()) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !senha) {
      toast.error("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      const { token, usuario } = await authService.login({ email, senha });

      // Persiste a sessão — é isto que faltava antes: sem o token salvo,
      // a rota protegida (ProtectedRoute) sempre mandava de volta para o login.
      authService.salvarSessao(token, usuario);

      toast.success(`Bem-vindo(a), ${usuario.nome.split(" ")[0]}!`);
      navigate("/home", { replace: true });
    } catch (error: any) {
      toast.error(error.message ?? "Não foi possível entrar. Verifique suas credenciais.");
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
            <IconBox size={26} color={cores.card} />
          </div>
          <h1 style={titulo}>Gestão de Produtos</h1>
          <p style={subtitulo}>Entre com sua conta para acessar o sistema</p>
        </div>

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
                autoComplete="email"
                style={{
                  ...input,
                  ...(inputFocus.email ? inputFocusStyle : {}),
                }}
                onFocus={() => setInputFocus((prev) => ({ ...prev, email: true }))}
                onBlur={() => setInputFocus((prev) => ({ ...prev, email: false }))}
                disabled={loading}
              />
            </div>
          </div>

          <div style={campoGroup}>
            <label style={label}>Senha</label>
            <div style={inputWrapper}>
              <span style={inputIcon}>
                <IconLock size={16} color={cores.textoFraco} />
              </span>
              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                style={{
                  ...input,
                  ...(inputFocus.senha ? inputFocusStyle : {}),
                }}
                onFocus={() => setInputFocus((prev) => ({ ...prev, senha: true }))}
                onBlur={() => setInputFocus((prev) => ({ ...prev, senha: false }))}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                style={toggleSenha}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? (
                  <IconEyeOff size={16} color={cores.textoFraco} />
                ) : (
                  <IconEye size={16} color={cores.textoFraco} />
                )}
              </button>
            </div>
          </div>

          <div style={opcoes}>
            <label style={checkboxLabel}>
              <input type="checkbox" style={checkbox} />
              Lembrar-me
            </label>
            <Link to="/esqueci-senha" style={esqueceuSenha}>
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            style={{
              ...btnEntrar,
              opacity: loading ? 0.75 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <IconSpinner size={16} color={cores.card} />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div style={footer}>
          <div style={footerLinks}>
            <a href="#" style={footerLink}>Termos</a>
            <span style={footerSeparator}>·</span>
            <a href="#" style={footerLink}>Privacidade</a>
            <span style={footerSeparator}>·</span>
            <a href="#" style={footerLink}>Ajuda</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Estilos
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
  padding: "48px 40px",
  maxWidth: "440px",
  width: "100%",
  boxShadow: "0 4px 24px rgba(15, 23, 42, 0.06)",
  border: `1px solid ${cores.border}`,
};

const header: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "32px",
};

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

const titulo: React.CSSProperties = {
  margin: 0,
  fontSize: "1.4rem",
  fontWeight: 700,
  color: cores.texto,
  letterSpacing: "-0.01em",
};

const subtitulo: React.CSSProperties = {
  margin: "8px 0 0",
  color: cores.textoSuave,
  fontSize: "0.88rem",
};

const form: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const campoGroup: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const label: React.CSSProperties = {
  fontSize: "0.82rem",
  fontWeight: 600,
  color: cores.texto,
};

const inputWrapper: React.CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
};

const inputIcon: React.CSSProperties = {
  position: "absolute",
  left: "12px",
  display: "flex",
  alignItems: "center",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "11px 12px 11px 38px",
  borderRadius: "8px",
  border: `1.5px solid ${cores.border}`,
  fontSize: "0.92rem",
  background: cores.bg,
  outline: "none",
  transition: "all 0.15s",
  fontFamily: "inherit",
};

const inputFocusStyle: React.CSSProperties = {
  borderColor: cores.acento,
  background: cores.card,
  boxShadow: `0 0 0 3px ${cores.acentoSuave}`,
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

const opcoes: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "-4px",
};

const checkboxLabel: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "0.85rem",
  color: cores.textoSuave,
  cursor: "pointer",
};

const checkbox: React.CSSProperties = {
  width: "15px",
  height: "15px",
  accentColor: cores.acento,
  cursor: "pointer",
};

const esqueceuSenha: React.CSSProperties = {
  fontSize: "0.85rem",
  color: cores.acento,
  textDecoration: "none",
  fontWeight: 600,
};

const btnEntrar: React.CSSProperties = {
  background: cores.primaria,
  color: cores.card,
  border: "none",
  borderRadius: "8px",
  padding: "13px",
  fontWeight: 600,
  fontSize: "0.95rem",
  transition: "background 0.15s",
  marginTop: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};

const footer: React.CSSProperties = {
  marginTop: "32px",
  textAlign: "center",
  borderTop: `1px solid ${cores.border}`,
  paddingTop: "20px",
};

const footerLinks: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "8px",
  fontSize: "0.8rem",
};

const footerLink: React.CSSProperties = {
  color: cores.textoSuave,
  textDecoration: "none",
};

const footerSeparator: React.CSSProperties = {
  color: cores.border,
};
