using Application.DTOs;
using Domain.Interfaces;

namespace Application.UseCases.Auth;

public sealed class RedefinirSenhaUseCase(
    IUsuarioRepository repository,
    IUnitOfWork unitOfWork,
    ITokenService tokenService)
{
    public async Task<string?> ExecutarAsync(RedefinirSenhaDto dto, CancellationToken ct = default)
    {
        if (dto.NovaSenha != dto.ConfirmarNovaSenha)
            return "A confirmação da nova senha não coincide.";

        var validacao = tokenService.Validar(dto.Token, TipoToken.RecuperacaoSenha);
        if (!validacao.Valido)
            return validacao.Erro ?? "Token inválido.";

        var usuario = await repository.ObterPorIdAsync(validacao.UsuarioId, ct);
        if (usuario is null)
            return "Usuário não encontrado.";

        var result = usuario.RedefinirSenha(dto.NovaSenha);
        if (!result.Sucesso)
            return result.Erro;

        await repository.AtualizarAsync(usuario, ct);
        await unitOfWork.CommitAsync(ct);

        return null;
    }
}
