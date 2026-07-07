using Application.DTOs;
using Application.Mappings;
using Domain.Interfaces;

namespace Application.UseCases.Auth;

public sealed class LoginUseCase(
    IUsuarioRepository repository,
    ITokenService tokenService)
{
    private const string ErroGenerico = "E-mail ou senha inválidos.";

    public async Task<(LoginResponseDto? Dto, string? Erro)> ExecutarAsync(
        LoginDto dto, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Senha))
            return (null, ErroGenerico);

        var usuario = await repository.ObterPorEmailAsync(dto.Email, ct);
        if (usuario is null || !usuario.Ativo)
            return (null, ErroGenerico);

        if (!usuario.VerificarSenha(dto.Senha))
            return (null, ErroGenerico);

        var token = tokenService.GerarTokenAcesso(usuario.Id, usuario.Email);
        return (new LoginResponseDto(token, usuario.ToDto()), null);
    }
}
