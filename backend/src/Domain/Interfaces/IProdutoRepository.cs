using Domain.Entities;

namespace Domain.Interfaces;

public interface IProdutoRepository
{
    Task<Produto?> ObterPorIdAsync(Guid id, CancellationToken ct = default);
    Task<Produto?> ObterPorSkuAsync(string sku, CancellationToken ct = default);
    Task<IEnumerable<Produto>> ListarAsync(CancellationToken ct = default);
    Task AdicionarAsync(Produto produto, CancellationToken ct = default);
    Task AtualizarAsync(Produto produto, CancellationToken ct = default);
    Task RemoverAsync(Produto produto, CancellationToken ct = default);
    Task<bool> ExisteSkuAsync(string sku, Guid? ignorarId = null, CancellationToken ct = default);
}
