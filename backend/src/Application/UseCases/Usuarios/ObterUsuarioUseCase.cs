using Application.DTOs;
using Application.Mappings;
using Domain.Interfaces;

namespace Application.UseCases.Usuarios;

public sealed class ObterUsuarioUseCase(IUsuarioRepository repository)
{
    public async Task<UsuarioDto?> ExecutarAsync(Guid id, CancellationToken ct = default)
    {
        var Usuario = await repository.ObterPorIdAsync(id, ct);
        return Usuario?.ToDto();
    }
}
