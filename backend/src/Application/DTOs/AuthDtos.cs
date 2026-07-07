namespace Application.DTOs;

public record LoginDto(string Email, string Senha);

public record LoginResponseDto(string Token, UsuarioDto Usuario);

public record EsqueciSenhaDto(string Email);

public record RedefinirSenhaDto(string Token, string NovaSenha, string ConfirmarNovaSenha);
