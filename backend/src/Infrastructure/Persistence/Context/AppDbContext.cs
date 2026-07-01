using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Context;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Produto> Produtos => Set<Produto>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        // ═══════════════════════════════════════════
        // Configuração da entidade Usuario
        // ═══════════════════════════════════════════
        mb.Entity<Usuario>(e =>
        {
            e.ToTable("Usuarios");
            e.HasKey(u => u.Id);
            e.Property(u => u.Id).ValueGeneratedNever();
            
            e.Property(u => u.Nome)
                .IsRequired()
                .HasMaxLength(200);
            
            e.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(256);
            
            // 🔑 Configuração do Value Object Cpf (Documento)
            e.OwnsOne(u => u.Documento, doc =>
            {
                doc.Property(d => d.Value)
                    .HasColumnName("Documento")
                    .IsRequired()
                    .HasMaxLength(11);
                
                doc.HasIndex(d => d.Value).IsUnique();
            });
            
            e.Property<string>("SenhaHash")
                .HasColumnName("SenhaHash")
                .IsRequired()
                .HasMaxLength(255);
            
            e.Property(u => u.CriadoEm)
                .IsRequired()
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            e.Property(u => u.AtualizadoEm)
                .IsRequired(false);
            
            e.Property(u => u.Ativo)
                .IsRequired()
                .HasDefaultValue(true);
            
            // Índice único para Email
            e.HasIndex(u => u.Email).IsUnique();
            
            e.Ignore(u => u.Eventos);
        });

        // ═══════════════════════════════════════════
        // Configuração da entidade Produto (já existente)
        // ═══════════════════════════════════════════
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