import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ProdutoModal } from "../components/ProdutoModal";
import { ProdutoTabela } from "../components/ProdutoTabela";
import { useProdutos } from "../hooks/useProdutos";
import type { Produto } from "../types/produto";

export function HomePage() {
  const { produtos, loading, criar, atualizar, remover } = useProdutos();
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [busca, setBusca] = useState("");

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.sku.toLowerCase().includes(busca.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirNovo = () => { setProdutoEditando(null); setModalAberto(true); };
  const abrirEditar = (p: Produto) => { setProdutoEditando(p); setModalAberto(true); };
  const fechar = () => { setModalAberto(false); setProdutoEditando(null); };

  const onSalvar = async (dto: any) => {
    if (produtoEditando) await atualizar(produtoEditando.id, dto);
    else await criar(dto);
  };

  const totalValor = produtos.reduce((acc, p) => acc + p.preco * p.estoque, 0);
  const emFalta = produtos.filter(p => p.estoque < 5).length;

  return (
    <div style={page}>
      <Toaster position="top-right" />
      <header style={header}>
        <div>
          <h1 style={titulo}>📦 Gestão de Produtos</h1>
          <p style={subtitulo}>Clean Architecture · DDD · .NET 8 + React + SQLite</p>
        </div>
        <button onClick={abrirNovo} style={btnNovo}>+ Novo Produto</button>
      </header>

      <div style={cards}>
        {[
          { label:"Total de Produtos", val: String(produtos.length), cor:"#0f172a" },
          { label:"Estoque Baixo (< 5)", val: String(emFalta), cor: emFalta > 0?"#dc2626":"#059669" },
          { label:"Valor em Estoque", val: totalValor.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}), cor:"#0f172a" },
          { label:"Categorias", val: String(new Set(produtos.map(p => p.categoria)).size), cor:"#0f172a" },
        ].map(c => (
          <div key={c.label} style={card}>
            <div style={cardLabel}>{c.label}</div>
            <div style={{ ...cardVal, color: c.cor }}>{c.val}</div>
          </div>
        ))}
      </div>

      <div style={toolbar}>
        <input style={searchInp} value={busca} onChange={e => setBusca(e.target.value)}
          placeholder="🔍  Buscar por nome, SKU ou categoria..." />
        <span style={{ color:"#94a3b8", fontSize:"0.85rem", whiteSpace:"nowrap" }}>
          {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:"60px", color:"#94a3b8" }}>⏳ Carregando...</div>
      ) : (
        <ProdutoTabela
          produtos={produtosFiltrados}
          onEditar={abrirEditar}
          onRemover={id => remover(id).catch(e => toast.error(e.message))}
        />
      )}

      {modalAberto && (
        <ProdutoModal produto={produtoEditando} onSalvar={onSalvar} onFechar={fechar} />
      )}
    </div>
  );
}

const page: React.CSSProperties = {
  minHeight:"100vh", background:"#f8fafc",
  padding:"32px", maxWidth:"1200px", margin:"0 auto"
};
const header: React.CSSProperties = {
  display:"flex", justifyContent:"space-between", alignItems:"flex-start",
  marginBottom:"28px", flexWrap:"wrap", gap:"16px"
};
const titulo: React.CSSProperties = { margin:0, fontSize:"1.75rem", fontWeight:800, color:"#0f172a" };
const subtitulo: React.CSSProperties = { margin:"4px 0 0", color:"#64748b", fontSize:"0.85rem" };
const btnNovo: React.CSSProperties = {
  background:"#6366f1", color:"#fff", border:"none",
  borderRadius:"10px", padding:"12px 24px", fontWeight:700,
  fontSize:"0.95rem", cursor:"pointer", whiteSpace:"nowrap"
};
const cards: React.CSSProperties = {
  display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",
  gap:"16px", marginBottom:"24px"
};
const card: React.CSSProperties = {
  background:"#fff", borderRadius:"12px", padding:"20px",
  boxShadow:"0 1px 4px rgba(0,0,0,0.06)", border:"1px solid #e2e8f0"
};
const cardLabel: React.CSSProperties = {
  fontSize:"0.78rem", color:"#94a3b8", fontWeight:600, textTransform:"uppercase"
};
const cardVal: React.CSSProperties = {
  fontSize:"1.8rem", fontWeight:800, color:"#0f172a", marginTop:"4px"
};
const toolbar: React.CSSProperties = {
  display:"flex", gap:"16px", alignItems:"center", marginBottom:"16px"
};
const searchInp: React.CSSProperties = {
  flex:1, padding:"10px 16px", borderRadius:"10px",
  border:"1.5px solid #e2e8f0", fontSize:"0.9rem",
  background:"#fff", outline:"none"
};
