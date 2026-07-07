import type { Usuario } from "./usuario";

export interface LoginDto {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface EsqueciSenhaDto {
  email: string;
}

export interface EsqueciSenhaResponse {
  mensagem: string;
  tokenDev?: string;
}

export interface RedefinirSenhaDto {
  token: string;
  novaSenha: string;
  confirmarNovaSenha: string;
}
