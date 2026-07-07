using Application.DTOs;
using Domain.Interfaces;

namespace Application.UseCases.Auth;

public sealed class EsqueciSenhaUseCase(
    IUsuarioRepository repository,
    ITokenService tokenService)
{
    /// <summary>
    /// Retorna o token de recuperação apenas se o e-mail existir e o usuário estiver ativo.
    /// Retorna null nos demais casos — a controller sempre deve responder com uma mensagem
    /// genérica ao cliente, para não revelar se o e-mail está cadastrado.
    /// </summary>
    public async Task<string?> ExecutarAsync(EsqueciSenhaDto dto, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Email))
            return null;

        var usuario = await repository.ObterPorEmailAsync(dto.Email, ct);
        if (usuario is null || !usuario.Ativo)
            return null;

        return tokenService.GerarTokenRecuperacaoSenha(usuario.Id);
    }
}
