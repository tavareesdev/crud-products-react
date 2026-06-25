using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public sealed class ProdutoRepository(AppDbContext context) : IProdutoRepository
{
    private readonly DbSet<Produto> _produtos = context.Set<Produto>();

    public async Task<Produto?> ObterPorIdAsync(Guid id, CancellationToken ct = default)
        => await _produtos.FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<Produto?> ObterPorSkuAsync(string sku, CancellationToken ct = default)
        => await _produtos.FirstOrDefaultAsync(p => EF.Property<string>(p, "Sku") == sku.ToUpperInvariant(), ct);

    public async Task<IEnumerable<Produto>> ListarAsync(CancellationToken ct = default)
        => await _produtos.ToListAsync(ct);

    public async Task AdicionarAsync(Produto produto, CancellationToken ct = default)
        => await _produtos.AddAsync(produto, ct);

    public Task AtualizarAsync(Produto produto, CancellationToken ct = default)
    {
        _produtos.Update(produto);
        return Task.CompletedTask;
    }

    public Task RemoverAsync(Produto produto, CancellationToken ct = default)
    {
        _produtos.Remove(produto);
        return Task.CompletedTask;
    }

    public async Task<bool> ExisteSkuAsync(string sku, Guid? ignorarId = null, CancellationToken ct = default)
    {
        var skuUp = sku.ToUpperInvariant();
        
        // Converte para string na query usando EF.Functions
        var query = _produtos.Where(p => 
            EF.Functions.Like(p.Sku.Valor, skuUp));
        
        if (ignorarId.HasValue)
            query = query.Where(p => p.Id != ignorarId.Value);
        
        return await query.AnyAsync(ct);
    }
}
