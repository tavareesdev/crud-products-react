using Application.DTOs;
using Application.Mappings;
using Domain.Interfaces;

namespace Application.UseCases.Usuarios;

public sealed class ListarUsuariosUseCase(IUsuarioRepository repository)
{
    public async Task<IEnumerable<UsuarioDto>> ExecutarAsync(CancellationToken ct = default)
        => (await repository.ListarAsync(ct)).Select(p => p.ToDto());
}
