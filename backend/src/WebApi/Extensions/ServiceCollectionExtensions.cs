using Application.UseCases.Produtos;
using Domain.Interfaces;
using Infrastructure.Persistence.Context;
using Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<AppDbContext>(opt =>
            opt.UseSqlite(config.GetConnectionString("SQLite")));
        services.AddScoped<IProdutoRepository, ProdutoRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        return services;
    }

    public static IServiceCollection AddApplicationUseCases(this IServiceCollection services)
    {
        services.AddScoped<ListarProdutosUseCase>();
        services.AddScoped<ObterProdutoUseCase>();
        services.AddScoped<CriarProdutoUseCase>();
        services.AddScoped<AtualizarProdutoUseCase>();
        services.AddScoped<RemoverProdutoUseCase>();
        return services;
    }
}
