import { useEffect, useState } from "react";
import type { AtualizarProdutoDto, CriarProdutoDto, Produto } from "../types/produto";

interface Props {
  produto?: Produto | null;
  onSalvar: (dto: CriarProdutoDto | AtualizarProdutoDto) => Promise<void>;
  onFechar: () => void;
}

const CATEGORIAS = ["Eletrônicos","Alimentos","Roupas","Livros","Casa","Esportes","Outros"];
const VAZIO = { nome:"", descricao:"", sku:"", preco:0, estoque:0, categoria:"Outros" };

export function ProdutoModal({ produto, onSalvar, onFechar }: Props) {
  const [form, setForm] = useState({ ...VAZIO });
  const [salvando, setSalvando] = useState(false);
  const editando = !!produto;

  useEffect(() => {
    if (produto) {
      setForm({ nome: produto.nome, descricao: produto.descricao, sku: produto.sku,
        preco: produto.preco, estoque: produto.estoque, categoria: produto.categoria });
    } else {
      setForm({ ...VAZIO });
    }
  }, [produto]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      if (editando) {
        const { sku, ...dto } = form;
        await onSalvar(dto);
      } else {
        await onSalvar(form);
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
          <h2 style={{ margin:0, fontSize:"1.2rem", fontWeight:700 }}>
            {editando ? "✏️ Editar Produto" : "➕ Novo Produto"}
          </h2>
          <button onClick={onFechar} style={btnClose}>✕</button>
        </div>
        <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
          <div style={row}>
            <div style={field}>
              <label style={label}>Nome *</label>
              <input style={inp} required value={form.nome}
                onChange={e => set("nome", e.target.value)} placeholder="Ex: Notebook Pro" />
            </div>
            <div style={{ ...field, flex:"0 0 140px" }}>
              <label style={label}>SKU *</label>
              <input style={inp} required value={form.sku} disabled={editando}
                onChange={e => set("sku", e.target.value)} placeholder="Ex: NB-001" />
            </div>
          </div>
          <div style={field}>
            <label style={label}>Descrição</label>
            <textarea style={{ ...inp, minHeight:"72px", resize:"vertical" }}
              value={form.descricao} onChange={e => set("descricao", e.target.value)}
              placeholder="Descreva o produto..." />
          </div>
          <div style={row}>
            <div style={field}>
              <label style={label}>Preço (R$) *</label>
              <input style={inp} type="number" step="0.01" min="0" required
                value={form.preco} onChange={e => set("preco", parseFloat(e.target.value)||0)} />
            </div>
            <div style={field}>
              <label style={label}>Estoque *</label>
              <input style={inp} type="number" min="0" required
                value={form.estoque} onChange={e => set("estoque", parseInt(e.target.value)||0)} />
            </div>
            <div style={field}>
              <label style={label}>Categoria</label>
              <select style={inp} value={form.categoria} onChange={e => set("categoria", e.target.value)}>
                {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"flex", gap:"8px", justifyContent:"flex-end", marginTop:"8px" }}>
            <button type="button" onClick={onFechar} style={btnSec}>Cancelar</button>
            <button type="submit" disabled={salvando} style={btnPri}>
              {salvando ? "Salvando..." : editando ? "Salvar Alterações" : "Criar Produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position:"fixed", inset:0, background:"rgba(15,23,42,0.7)",
  display:"flex", alignItems:"center", justifyContent:"center",
  zIndex:1000, backdropFilter:"blur(4px)"
};
const modal: React.CSSProperties = {
  background:"#fff", borderRadius:"16px", padding:"28px",
  width:"min(600px, 95vw)", boxShadow:"0 24px 60px rgba(0,0,0,0.2)",
  maxHeight:"90vh", overflowY:"auto"
};
const modalHeader: React.CSSProperties = {
  display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"
};
const row: React.CSSProperties = { display:"flex", gap:"12px" };
const field: React.CSSProperties = { display:"flex", flexDirection:"column", gap:"4px", flex:1 };
const label: React.CSSProperties = { fontSize:"0.8rem", fontWeight:600, color:"#475569" };
const inp: React.CSSProperties = {
  padding:"8px 12px", borderRadius:"8px", border:"1.5px solid #e2e8f0",
  fontSize:"0.9rem", outline:"none", fontFamily:"inherit"
};
const btnClose: React.CSSProperties = {
  background:"none", border:"none", fontSize:"1.2rem", cursor:"pointer", color:"#94a3b8", padding:"4px 8px"
};
const btnPri: React.CSSProperties = {
  background:"#6366f1", color:"#fff", border:"none",
  borderRadius:"8px", padding:"10px 22px", fontWeight:600, fontSize:"0.9rem", cursor:"pointer"
};
const btnSec: React.CSSProperties = {
  background:"#f1f5f9", color:"#475569", border:"none",
  borderRadius:"8px", padding:"10px 22px", fontWeight:600, fontSize:"0.9rem", cursor:"pointer"
};
