using Application.DTOs;
using Domain.Entities;

namespace Application.Mappings;

public static class ProdutoMapper
{
    public static ProdutoDto ToDto(this Produto p) => new(
        p.Id, p.Nome, p.Descricao, p.Sku.Valor, p.Preco.Valor,
        p.Estoque, p.Categoria, p.Ativo, p.CriadoEm, p.AtualizadoEm);
}
