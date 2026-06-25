using Domain.Events;
using Domain.ValueObjects;

namespace Domain.Entities;

public sealed class Produto : EntidadeBase
{
    public string Nome { get; private set; } = string.Empty;
    public string Descricao { get; private set; } = string.Empty;
    public Sku Sku { get; private set; } = null!;
    public Preco Preco { get; private set; } = null!;
    public int Estoque { get; private set; }
    public string Categoria { get; private set; } = string.Empty;
    public bool Ativo { get; private set; } = true;

    private Produto() { }

    public static Result<Produto> Criar(
        string nome, string descricao, string sku,
        decimal preco, int estoque, string categoria)
    {
        if (string.IsNullOrWhiteSpace(nome))
            return Result<Produto>.Failure("Nome é obrigatório.");
        if (nome.Length > 200)
            return Result<Produto>.Failure("Nome deve ter no máximo 200 caracteres.");
        if (estoque < 0)
            return Result<Produto>.Failure("Estoque não pode ser negativo.");

        var skuResult = Sku.Criar(sku);
        if (!skuResult.Sucesso) return Result<Produto>.Failure(skuResult.Erro!);

        var precoResult = Preco.Criar(preco);
        if (!precoResult.Sucesso) return Result<Produto>.Failure(precoResult.Erro!);

        var produto = new Produto
        {
            Nome = nome.Trim(),
            Descricao = descricao?.Trim() ?? string.Empty,
            Sku = skuResult.Dado!,
            Preco = precoResult.Dado!,
            Estoque = estoque,
            Categoria = categoria?.Trim() ?? string.Empty
        };

        produto.AdicionarEvento(new ProdutoCriadoEvent(produto.Id, produto.Nome));
        return Result<Produto>.Success(produto);
    }

    public Result<Produto> Atualizar(
        string nome, string descricao, decimal preco, int estoque, string categoria)
    {
        if (string.IsNullOrWhiteSpace(nome))
            return Result<Produto>.Failure("Nome é obrigatório.");
        if (estoque < 0)
            return Result<Produto>.Failure("Estoque não pode ser negativo.");

        var precoResult = Preco.Criar(preco);
        if (!precoResult.Sucesso) return Result<Produto>.Failure(precoResult.Erro!);

        Nome = nome.Trim();
        Descricao = descricao?.Trim() ?? string.Empty;
        Preco = precoResult.Dado!;
        Estoque = estoque;
        Categoria = categoria?.Trim() ?? string.Empty;
        AtualizadoEm = DateTime.UtcNow;

        AdicionarEvento(new ProdutoAtualizadoEvent(Id));
        return Result<Produto>.Success(this);
    }

    public void Desativar()
    {
        Ativo = false;
        AtualizadoEm = DateTime.UtcNow;
        AdicionarEvento(new ProdutoRemovidoEvent(Id));
    }
}
