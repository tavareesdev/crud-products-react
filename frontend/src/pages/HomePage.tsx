import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Layout } from "../components/Layout";
import { ProdutoModal } from "../components/ProdutoModal";
import { ProdutoTabela } from "../components/ProdutoTabela";
import { IconPlus, IconSearch } from "../components/icons";
import { useProdutos } from "../hooks/useProdutos";
import { cores } from "../styles/theme";
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
    <Layout>
      <Toaster position="top-right" />
      <header style={header}>
        <div>
          <h1 style={titulo}>Gestão de Produtos</h1>
          <p style={subtitulo}>Clean Architecture · DDD · .NET + React + SQLite</p>
        </div>
        <button onClick={abrirNovo} style={btnNovo}>
          <IconPlus size={16} />
          Novo produto
        </button>
      </header>

      <div style={cards}>
        {[
          { label: "Total de produtos", val: String(produtos.length), cor: cores.texto },
          { label: "Estoque baixo (< 5)", val: String(emFalta), cor: emFalta > 0 ? cores.erro : cores.sucesso },
          { label: "Valor em estoque", val: totalValor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), cor: cores.texto },
          { label: "Categorias", val: String(new Set(produtos.map(p => p.categoria)).size), cor: cores.texto },
        ].map(c => (
          <div key={c.label} style={card}>
            <div style={cardLabel}>{c.label}</div>
            <div style={{ ...cardVal, color: c.cor }}>{c.val}</div>
          </div>
        ))}
      </div>

      <div style={toolbar}>
        <div style={searchWrapper}>
          <span style={searchIcon}><IconSearch size={16} color={cores.textoFraco} /></span>
          <input
            style={searchInp}
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome, SKU ou categoria..."
          />
        </div>
        <span style={{ color: cores.textoFraco, fontSize: "0.85rem", whiteSpace: "nowrap" }}>
          {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: cores.textoFraco }}>Carregando...</div>
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
const cards: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px", marginBottom: "24px"
};
const card: React.CSSProperties = {
  background: cores.card, borderRadius: "10px", padding: "20px",
  boxShadow: "0 1px 4px rgba(15,23,42,0.05)", border: `1px solid ${cores.border}`
};
const cardLabel: React.CSSProperties = {
  fontSize: "0.76rem", color: cores.textoFraco, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em"
};
const cardVal: React.CSSProperties = {
  fontSize: "1.7rem", fontWeight: 700, color: cores.texto, marginTop: "4px"
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
