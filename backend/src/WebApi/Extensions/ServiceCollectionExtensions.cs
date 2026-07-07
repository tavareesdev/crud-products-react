using Application.UseCases.Auth;
using Application.UseCases.Produtos;
using Application.UseCases.Usuarios;
using Domain.Interfaces;
using Infrastructure.Persistence.Context;
using Infrastructure.Persistence.Repositories;
using Infrastructure.Security;
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
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddSingleton<ITokenService, TokenService>();
        return services;
    }

    public static IServiceCollection AddApplicationUseCases(this IServiceCollection services)
    {
        services.AddScoped<ListarProdutosUseCase>();
        services.AddScoped<ObterProdutoUseCase>();
        services.AddScoped<CriarProdutoUseCase>();
        services.AddScoped<AtualizarProdutoUseCase>();
        services.AddScoped<RemoverProdutoUseCase>();
        services.AddScoped<ListarUsuariosUseCase>();
        services.AddScoped<ObterUsuarioUseCase>();
        services.AddScoped<CriarUsuarioUseCase>();
        services.AddScoped<AtualizarUsuarioUseCase>();
        services.AddScoped<RemoverUsuarioUseCase>();
        services.AddScoped<AtualizarSenhaUseCase>();
        services.AddScoped<LoginUseCase>();
        services.AddScoped<EsqueciSenhaUseCase>();
        services.AddScoped<RedefinirSenhaUseCase>();
        return services;
    }
}
