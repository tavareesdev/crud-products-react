using Domain.Interfaces;

namespace Application.UseCases.Usuarios;

public sealed class RemoverUsuarioUseCase(
    IUsuarioRepository repository,
    IUnitOfWork unitOfWork)
{
    public async Task<string?> ExecutarAsync(Guid id, CancellationToken ct = default)
    {
        var Usuario = await repository.ObterPorIdAsync(id, ct);
        if (Usuario is null) return "Usuario não encontrado.";

        Usuario.Desativar();
        await repository.RemoverAsync(Usuario, ct);
        await unitOfWork.CommitAsync(ct);
        return null;
    }
}
