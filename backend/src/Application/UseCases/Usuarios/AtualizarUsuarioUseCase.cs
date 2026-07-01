using Application.DTOs;
using Application.Mappings;
using Domain.Interfaces;
using Domain.ValueObjects;

namespace Application.UseCases.Usuarios;

public sealed class AtualizarUsuarioUseCase(
    IUsuarioRepository repository,
    IUnitOfWork unitOfWork)
{
    public async Task<(UsuarioDto? Dto, string? Erro)> ExecutarAsync(
        Guid id, AtualizarUsuarioDto dto, CancellationToken ct = default)
    {
        var usuario = await repository.ObterPorIdAsync(id, ct);
        if (usuario is null) return (null, "Usuario não encontrado.");
        
        var emailExists = await repository.ExisteEmailAsync(dto.Email, id, ct);
        if (emailExists)
            return (null, "Email já cadastrado.");

        if (!EmailValidator.IsValid(dto.Email))
            return (null, "Email inválido.");

        var cpfExists = await repository.ExisteDocumentoAsync(dto.Documento, id, ct);
        if (cpfExists)
            return (null, "Documento já cadastrado.");

        var cpfResult = Cpf.Create(dto.Documento);
        if (!cpfResult.Sucesso)
            return (null, cpfResult.Erro);

        var result = usuario.Atualizar(dto.Nome, dto.Email, cpfResult.Dado!);
        if (!result.Sucesso) return (null, result.Erro);

        await repository.AtualizarAsync(usuario, ct);
        await unitOfWork.CommitAsync(ct);
        return (usuario.ToDto(), null);
    }
}
