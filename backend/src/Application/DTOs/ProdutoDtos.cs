namespace Application.DTOs;

public record ProdutoDto(
    Guid Id,
    string Nome,
    string Descricao,
    string Sku,
    decimal Preco,
    int Estoque,
    string Categoria,
    bool Ativo,
    DateTime CriadoEm,
    DateTime? AtualizadoEm);

public record CriarProdutoDto(
    string Nome,
    string Descricao,
    string Sku,
    decimal Preco,
    int Estoque,
    string Categoria);

public record AtualizarProdutoDto(
    string Nome,
    string Descricao,
    decimal Preco,
    int Estoque,
    string Categoria);
