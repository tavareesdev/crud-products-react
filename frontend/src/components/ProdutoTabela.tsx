import type { Produto } from "../types/produto";
import { IconBox, IconEdit, IconTrash } from "./icons";
import { cores } from "../styles/theme";

interface Props {
  produtos: Produto[];
  onEditar: (p: Produto) => void;
  onRemover: (id: string) => void;
}

export function ProdutoTabela({ produtos, onEditar, onRemover }: Props) {
  if (produtos.length === 0) {
    return (
      <div style={empty}>
        <div style={{ display:"flex", justifyContent:"center" }}>
          <IconBox size={40} color={cores.textoFraco} />
        </div>
        <p style={{ color: cores.textoFraco, margin:"12px 0 0" }}>Nenhum produto cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX:"auto", borderRadius:"12px", border:"1px solid #e2e8f0" }}>
      <table style={tabela}>
        <thead>
          <tr style={{ background:"#f8fafc" }}>
            {["SKU","Nome","Categoria","Preço","Estoque","Status","Ações"].map(h => (
              <th key={h} style={th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {produtos.map((p, i) => (
            <tr key={p.id} style={{ background: i%2===0?"#fff":"#fafafa" }}>
              <td style={td}><span style={badge}>{p.sku}</span></td>
              <td style={{ ...td, fontWeight:500, maxWidth:"200px" }}>
                <div style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}
                  title={p.nome}>{p.nome}</div>
                {p.descricao && (
                  <div style={{ fontSize:"0.75rem", color:"#94a3b8", overflow:"hidden",
                    textOverflow:"ellipsis", whiteSpace:"nowrap" }} title={p.descricao}>
                    {p.descricao}
                  </div>
                )}
              </td>
              <td style={td}>{p.categoria}</td>
              <td style={{ ...td, fontWeight:600, color:"#059669" }}>
                {p.preco.toLocaleString("pt-BR", { style:"currency", currency:"BRL" })}
              </td>
              <td style={{ ...td, textAlign:"center" }}>
                <span style={{ color:p.estoque < 5?"#dc2626":"#374151", fontWeight:600 }}>
                  {p.estoque}
                </span>
              </td>
              <td style={td}>
                <span style={{
                  padding:"2px 10px", borderRadius:"20px", fontSize:"0.75rem", fontWeight:600,
                  background:p.ativo?"#dcfce7":"#fee2e2", color:p.ativo?"#166534":"#991b1b"
                }}>
                  {p.ativo ? "Ativo" : "Inativo"}
                </span>
              </td>
              <td style={{ ...td, whiteSpace:"nowrap" }}>
                <button onClick={() => onEditar(p)} style={btn} title="Editar">
                  <IconEdit size={15} color={cores.textoSuave} />
                </button>
                <button onClick={() => {
                  if (confirm(`Remover "${p.nome}"?`)) onRemover(p.id);
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
  textAlign:"center", padding:"60px 20px",
  border:"2px dashed #e2e8f0", borderRadius:"12px"
};
const tabela: React.CSSProperties = { width:"100%", borderCollapse:"collapse", fontSize:"0.875rem" };
const th: React.CSSProperties = {
  padding:"12px 16px", textAlign:"left", fontWeight:600,
  color:"#475569", fontSize:"0.78rem", textTransform:"uppercase", letterSpacing:"0.05em"
};
const td: React.CSSProperties = { padding:"12px 16px", color:"#374151", verticalAlign:"middle" };
const badge: React.CSSProperties = {
  background:"#ede9fe", color:"#5b21b6", padding:"2px 8px",
  borderRadius:"6px", fontSize:"0.78rem", fontWeight:700, fontFamily:"monospace"
};
const btn: React.CSSProperties = {
  background:"none", border:"none", cursor:"pointer", fontSize:"1rem", padding:"4px 6px", borderRadius:"6px"
};
