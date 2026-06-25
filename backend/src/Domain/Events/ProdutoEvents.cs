namespace Domain.Events;

public sealed class ProdutoCriadoEvent : DomainEvent
{
    public Guid ProdutoId { get; }
    public string Nome { get; }
    public ProdutoCriadoEvent(Guid produtoId, string nome) { ProdutoId = produtoId; Nome = nome; }
}

public sealed class ProdutoAtualizadoEvent : DomainEvent
{
    public Guid ProdutoId { get; }
    public ProdutoAtualizadoEvent(Guid produtoId) => ProdutoId = produtoId;
}

public sealed class ProdutoRemovidoEvent : DomainEvent
{
    public Guid ProdutoId { get; }
    public ProdutoRemovidoEvent(Guid produtoId) => ProdutoId = produtoId;
}
