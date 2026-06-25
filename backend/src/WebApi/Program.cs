using Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using WebApi.Extensions;
using WebApi.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// Configurar logging para ver tudo
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
    c.SwaggerDoc("v1", new() { Title = "CRUD Produtos API", Version = "v1" }));

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplicationUseCases();

builder.Services.AddDbContext<AppDbContext>((serviceProvider, options) =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    Console.WriteLine($"🔍 Connection String: {connectionString}");
    options.UseSqlite(connectionString, 
        b => b.MigrationsAssembly("Infrastructure"));
    options.EnableSensitiveDataLogging(); // <-- Mostra dados sensíveis nos logs
    options.EnableDetailedErrors(); // <-- Mostra erros detalhados
});

builder.Services.AddCors(opt =>
    opt.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var connection = db.Database.GetDbConnection();
    Console.WriteLine($"📁 Banco de dados: {connection.DataSource}");
    Console.WriteLine($"📁 Diretório atual: {Directory.GetCurrentDirectory()}");
    
    // Verifica se o banco existe
    var dbPath = connection.DataSource;
    Console.WriteLine($"📁 Arquivo existe? {File.Exists(dbPath)}");
    
    Console.WriteLine("🔄 Aplicando migrations...");
    await db.Database.MigrateAsync();
    Console.WriteLine("✅ Migrations aplicadas!");
    
    // Lista as tabelas
    var tables = await db.Database.SqlQueryRaw<string>("SELECT name FROM sqlite_master WHERE type='table';").ToListAsync();
    Console.WriteLine($"📋 Tabelas encontradas: {string.Join(", ", tables)}");
}

app.UseMiddleware<ExceptionMiddleware>();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowFrontend");
app.MapControllers();

Console.WriteLine("🚀 Aplicação iniciada!");
app.Run();