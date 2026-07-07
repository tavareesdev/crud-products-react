namespace Domain.Interfaces;

public enum TipoToken
{
    Acesso,
    RecuperacaoSenha
}

public sealed record TokenValidado(bool Valido, Guid UsuarioId, string? Erro);

public interface ITokenService
{
    /// <summary>
    /// Gera um token de acesso (sessão) para o usuário autenticado.
    /// </summary>
    string GerarTokenAcesso(Guid usuarioId, string email);

    /// <summary>
    /// Gera um token de curta duração para o fluxo de "esqueci minha senha".
    /// </summary>
    string GerarTokenRecuperacaoSenha(Guid usuarioId);

    /// <summary>
    /// Valida um token e confere se o tipo bate com o esperado.
    /// </summary>
    TokenValidado Validar(string token, TipoToken tipoEsperado);
}
