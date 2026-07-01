export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  criadoEm: string;
  atualizadoEm: string | null;
  ativo: boolean;
}