export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  sku: string;
  preco: number;
  estoque: number;
  categoria: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string | null;
}

export interface CriarProdutoDto {
  nome: string;
  descricao: string;
  sku: string;
  preco: number;
  estoque: number;
  categoria: string;
}

export interface AtualizarProdutoDto {
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria: string;
}
