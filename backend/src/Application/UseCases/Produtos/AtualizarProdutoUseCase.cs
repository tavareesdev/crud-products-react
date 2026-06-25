using Application.DTOs;
using Application.Mappings;
using Domain.Interfaces;

namespace Application.UseCases.Produtos;

public sealed class AtualizarProdutoUseCase(
    IProdutoRepository repository,
    IUnitOfWork unitOfWork)
{
    public async Task<(ProdutoDto? Dto, string? Erro)> ExecutarAsync(
        Guid id, AtualizarProdutoDto dto, CancellationToken ct = default)
    {
        var produto = await repository.ObterPorIdAsync(id, ct);
        if (produto is null) return (null, "Produto não encontrado.");

        var result = produto.Atualizar(dto.Nome, dto.Descricao, dto.Preco, dto.Estoque, dto.Categoria);
        if (!result.Sucesso) return (null, result.Erro);

        await repository.AtualizarAsync(produto, ct);
        await unitOfWork.CommitAsync(ct);
        return (produto.ToDto(), null);
    }
}
