import { useState, FormEvent, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
    const token = localStorage.getItem('auth_token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  // Adicionar estilo da animação via style tag
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      toast.error("Preencha todos os campos!");
      return;
    }

    setLoading(true);
    
    try {
      // Simulando uma requisição de login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // const response = await api.login({ email, senha });
      
      toast.success("Login realizado com sucesso!");
      
      // Redirecionar para home
      navigate('/home', { replace: true });
      
    } catch (error) {
      toast.error("Erro ao realizar login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <Toaster position="top-right" />
      
      <div style={container}>
        {/* Logo e título */}
        <div style={header}>
          <div style={logo}>📦</div>
          <h1 style={titulo}>Gestão de Produtos</h1>
          <p style={subtitulo}>Faça login para acessar o sistema</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={form}>
          <div style={campoGroup}>
            <label style={label}>E-mail</label>
            <div style={inputWrapper}>
              <span style={inputIcon}>✉️</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                style={{
                  ...input,
                  ...(inputFocus.email ? inputFocusStyle : {}),
                }}
                onFocus={() => setInputFocus(prev => ({ ...prev, email: true }))}
                onBlur={() => setInputFocus(prev => ({ ...prev, email: false }))}
                disabled={loading}
              />
            </div>
          </div>

          <div style={campoGroup}>
            <label style={label}>Senha</label>
            <div style={inputWrapper}>
              <span style={inputIcon}>🔒</span>
              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                style={{
                  ...input,
                  ...(inputFocus.senha ? inputFocusStyle : {}),
                }}
                onFocus={() => setInputFocus(prev => ({ ...prev, senha: true }))}
                onBlur={() => setInputFocus(prev => ({ ...prev, senha: false }))}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                style={toggleSenha}
              >
                {mostrarSenha ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div style={opcoes}>
            <label style={checkboxLabel}>
              <input type="checkbox" style={checkbox} />
              Lembrar-me
            </label>
            <a href="#" style={esqueceuSenha}>Esqueceu a senha?</a>
          </div>

          <button 
            type="submit" 
            style={{
              ...btnEntrar,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={spinner}></span>
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        {/* Rodapé */}
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
  background: "#f8fafc",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};

const container: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "20px",
  padding: "48px 40px",
  maxWidth: "440px",
  width: "100%",
  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
  border: "1px solid #e2e8f0",
};

const header: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "32px",
};

const logo: React.CSSProperties = {
  fontSize: "3rem",
  marginBottom: "12px",
};

const titulo: React.CSSProperties = {
  margin: 0,
  fontSize: "1.5rem",
  fontWeight: 800,
  color: "#0f172a",
};

const subtitulo: React.CSSProperties = {
  margin: "8px 0 0",
  color: "#64748b",
  fontSize: "0.9rem",
};

const form: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const campoGroup: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const label: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#0f172a",
};

const inputWrapper: React.CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
};

const inputIcon: React.CSSProperties = {
  position: "absolute",
  left: "12px",
  fontSize: "1rem",
  color: "#94a3b8",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "12px 12px 12px 40px",
  borderRadius: "10px",
  border: "1.5px solid #e2e8f0",
  fontSize: "0.95rem",
  background: "#f8fafc",
  outline: "none",
  transition: "all 0.2s",
};

const inputFocusStyle: React.CSSProperties = {
  borderColor: "#6366f1",
  background: "#ffffff",
  boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
};

const toggleSenha: React.CSSProperties = {
  position: "absolute",
  right: "12px",
  background: "none",
  border: "none",
  fontSize: "1.1rem",
  cursor: "pointer",
  padding: "4px",
  color: "#94a3b8",
};

const opcoes: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "4px",
};

const checkboxLabel: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "0.85rem",
  color: "#475569",
  cursor: "pointer",
};

const checkbox: React.CSSProperties = {
  width: "16px",
  height: "16px",
  accentColor: "#6366f1",
  cursor: "pointer",
};

const esqueceuSenha: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#6366f1",
  textDecoration: "none",
  fontWeight: 500,
};

const btnEntrar: React.CSSProperties = {
  background: "#6366f1",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  padding: "14px",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
  transition: "all 0.2s",
  marginTop: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};

const spinner: React.CSSProperties = {
  display: "inline-block",
  width: "18px",
  height: "18px",
  border: "2px solid rgba(255,255,255,0.3)",
  borderTop: "2px solid #ffffff",
  borderRadius: "50%",
  animation: "spin 0.6s linear infinite",
};

const footer: React.CSSProperties = {
  marginTop: "32px",
  textAlign: "center",
  borderTop: "1px solid #e2e8f0",
  paddingTop: "24px",
};

const footerText: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  color: "#94a3b8",
  marginBottom: "12px",
};

const footerLinks: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "8px",
  fontSize: "0.8rem",
};

const footerLink: React.CSSProperties = {
  color: "#64748b",
  textDecoration: "none",
};

const footerSeparator: React.CSSProperties = {
  color: "#cbd5e1",
};