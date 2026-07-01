using Application.DTOs;
using Application.Mappings;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCases.Usuarios;

public sealed class CriarUsuarioUseCase(
    IUsuarioRepository repository,
    IUnitOfWork unitOfWork)
{
    public async Task<(UsuarioDto? Dto, string? Erro)> ExecutarAsync(
        CriarUsuarioDto dto, CancellationToken ct = default)
    {
        if (await repository.ExisteEmailAsync(dto.Email, ct: ct))
            return (null, $"Email '{dto.Email}' já está em uso.");

        if (await repository.ExisteDocumentoAsync(dto.Documento, ct: ct))
            return (null, $"Documento '{dto.Documento}' já está em uso.");

        var result = Usuario.Criar(dto.Nome, dto.Email, dto.Senha, dto.Documento);
        if (!result.Sucesso) return (null, result.Erro);

        await repository.AdicionarAsync(result.Dado!, ct);
        await unitOfWork.CommitAsync(ct);
        return (result.Dado!.ToDto(), null);
    }
}
