using Domain.Interfaces;

namespace Application.UseCases.Produtos;

public sealed class RemoverProdutoUseCase(
    IProdutoRepository repository,
    IUnitOfWork unitOfWork)
{
    public async Task<string?> ExecutarAsync(Guid id, CancellationToken ct = default)
    {
        var produto = await repository.ObterPorIdAsync(id, ct);
        if (produto is null) return "Produto não encontrado.";

        produto.Desativar();
        await repository.RemoverAsync(produto, ct);
        await unitOfWork.CommitAsync(ct);
        return null;
    }
}
