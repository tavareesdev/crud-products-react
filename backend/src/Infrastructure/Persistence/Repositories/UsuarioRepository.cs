using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public sealed class UsuarioRepository(AppDbContext context) : IUsuarioRepository
{
    private readonly DbSet<Usuario> _usuarios = context.Set<Usuario>();

    public async Task<Usuario?> ObterPorIdAsync(Guid id, CancellationToken ct = default)
        => await _usuarios.FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<IEnumerable<Usuario>> ListarAsync(CancellationToken ct = default)
        => await _usuarios.ToListAsync(ct);

    public async Task AdicionarAsync(Usuario usuario, CancellationToken ct = default)
        => await _usuarios.AddAsync(usuario, ct);

    public Task AtualizarAsync(Usuario usuario, CancellationToken ct = default)
    {
        _usuarios.Update(usuario);
        return Task.CompletedTask;
    }

    public Task RemoverAsync(Usuario usuario, CancellationToken ct = default)
    {
        _usuarios.Remove(usuario);
        return Task.CompletedTask;
    }

    public async Task<bool> ExisteEmailAsync(string email, Guid? ignorarId = null, CancellationToken ct = default)
    {
        var emailUp = email.ToUpperInvariant();
        
        var query = _usuarios.Where(p => 
            EF.Functions.Like(p.Email, emailUp));
        
        if (ignorarId.HasValue)
            query = query.Where(p => p.Id != ignorarId.Value);
        
        return await query.AnyAsync(ct);
    }

    public async Task<bool> ExisteDocumentoAsync(string documento, Guid? ignorarId = null, CancellationToken ct = default)
    {
        var documentoUp = documento.ToUpperInvariant();
        
        var query = _usuarios.Where(p => 
            EF.Functions.Like(p.Documento.Value, documentoUp));
        
        if (ignorarId.HasValue)
            query = query.Where(p => p.Id != ignorarId.Value);
        
        return await query.AnyAsync(ct);
    }
}
