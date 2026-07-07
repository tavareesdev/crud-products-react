export interface Usuario {
  id: string;
  nome: string;
  email: string;
  documento: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string | null;
}

export interface CriarUsuarioDto {
  nome: string;
  email: string;
  documento: string;
  senha: string;
}

export interface AtualizarUsuarioDto {
  nome: string;
  email: string;
  documento: string;
}

export interface AtualizarSenhaDto {
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
}