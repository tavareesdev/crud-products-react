using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Context;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Produto> Produtos => Set<Produto>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<Produto>(e =>
        {
            e.HasKey(p => p.Id);
            e.Property(p => p.Id).ValueGeneratedNever();
            e.Property(p => p.Nome).IsRequired().HasMaxLength(200);
            e.Property(p => p.Descricao).HasMaxLength(1000);
            e.Property(p => p.Categoria).HasMaxLength(100);
            e.Property(p => p.Ativo).IsRequired();
            e.Property(p => p.CriadoEm).IsRequired();

            e.OwnsOne(p => p.Preco, preco =>
                preco.Property(pr => pr.Valor)
                     .HasColumnName("Preco")
                     .IsRequired()
                     .HasColumnType("decimal(18,2)"));

            e.OwnsOne(p => p.Sku, sku =>
            {
                sku.Property(s => s.Valor)
                   .HasColumnName("Sku")
                   .IsRequired()
                   .HasMaxLength(50);
                sku.HasIndex(s => s.Valor).IsUnique();
            });

            e.Ignore(p => p.Eventos);
        });
    }
}
