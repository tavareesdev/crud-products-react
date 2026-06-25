using Application.DTOs;
using Application.Mappings;
using Domain.Interfaces;

namespace Application.UseCases.Produtos;

public sealed class ObterProdutoUseCase(IProdutoRepository repository)
{
    public async Task<ProdutoDto?> ExecutarAsync(Guid id, CancellationToken ct = default)
    {
        var produto = await repository.ObterPorIdAsync(id, ct);
        return produto?.ToDto();
    }
}
