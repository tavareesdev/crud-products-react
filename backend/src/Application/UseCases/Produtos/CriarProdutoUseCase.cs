using Application.DTOs;
using Application.Mappings;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.UseCases.Produtos;

public sealed class CriarProdutoUseCase(
    IProdutoRepository repository,
    IUnitOfWork unitOfWork)
{
    public async Task<(ProdutoDto? Dto, string? Erro)> ExecutarAsync(
        CriarProdutoDto dto, CancellationToken ct = default)
    {
        if (await repository.ExisteSkuAsync(dto.Sku, ct: ct))
            return (null, $"SKU '{dto.Sku.ToUpperInvariant()}' já está em uso.");

        var result = Produto.Criar(dto.Nome, dto.Descricao, dto.Sku, dto.Preco, dto.Estoque, dto.Categoria);
        if (!result.Sucesso) return (null, result.Erro);

        await repository.AdicionarAsync(result.Dado!, ct);
        await unitOfWork.CommitAsync(ct);
        return (result.Dado!.ToDto(), null);
    }
}
