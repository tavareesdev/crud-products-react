using Application.DTOs;
using Application.Mappings;
using Domain.Interfaces;

namespace Application.UseCases.Produtos;

public sealed class ListarProdutosUseCase(IProdutoRepository repository)
{
    public async Task<IEnumerable<ProdutoDto>> ExecutarAsync(CancellationToken ct = default)
        => (await repository.ListarAsync(ct)).Select(p => p.ToDto());
}
