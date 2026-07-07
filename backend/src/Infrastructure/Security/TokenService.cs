using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Domain.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Security;

/// <summary>
/// Serviço de tokens auto-contido (não depende de pacotes externos de JWT).
/// Gera um token no formato "payloadBase64Url.assinaturaBase64Url", assinado com
/// HMAC-SHA256 usando uma chave secreta definida em appsettings ("Auth:SecretKey").
///
/// Observação: isto cobre a necessidade de autenticação da aplicação (login,
/// proteção de rotas no frontend e fluxo de recuperação de senha). Para proteger
/// também os endpoints do backend com [Authorize], adicione o pacote
/// Microsoft.AspNetCore.Authentication.JwtBearer e troque esta implementação por
/// JWT padrão, se desejar.
/// </summary>
public sealed class TokenService : ITokenService
{
    private readonly byte[] _chave;
    private readonly TimeSpan _duracaoAcesso;
    private readonly TimeSpan _duracaoRecuperacao;

    private sealed record Payload(string sub, string? email, string typ, long exp);

    public TokenService(IConfiguration config)
    {
        var secret = config["Auth:SecretKey"];
        if (string.IsNullOrWhiteSpace(secret) || secret.Length < 32)
            throw new InvalidOperationException(
                "Auth:SecretKey não configurada ou muito curta (mínimo 32 caracteres). Configure em appsettings.json.");

        _chave = Encoding.UTF8.GetBytes(secret);

        var horasAcessoTexto = config["Auth:TokenAcessoHoras"];
        var minutosRecuperacaoTexto = config["Auth:TokenRecuperacaoMinutos"];

        var horasAcesso = double.TryParse(horasAcessoTexto, System.Globalization.NumberStyles.Any,
            System.Globalization.CultureInfo.InvariantCulture, out var h) ? h : 8;
        var minutosRecuperacao = double.TryParse(minutosRecuperacaoTexto, System.Globalization.NumberStyles.Any,
            System.Globalization.CultureInfo.InvariantCulture, out var m) ? m : 30;

        _duracaoAcesso = TimeSpan.FromHours(horasAcesso);
        _duracaoRecuperacao = TimeSpan.FromMinutes(minutosRecuperacao);
    }

    public string GerarTokenAcesso(Guid usuarioId, string email)
        => GerarToken(usuarioId, email, "acesso", _duracaoAcesso);

    public string GerarTokenRecuperacaoSenha(Guid usuarioId)
        => GerarToken(usuarioId, null, "reset", _duracaoRecuperacao);

    public TokenValidado Validar(string token, TipoToken tipoEsperado)
    {
        if (string.IsNullOrWhiteSpace(token))
            return new TokenValidado(false, Guid.Empty, "Token não informado.");

        var partes = token.Split('.');
        if (partes.Length != 2)
            return new TokenValidado(false, Guid.Empty, "Token inválido.");

        byte[] payloadBytes;
        byte[] assinaturaRecebida;
        try
        {
            payloadBytes = Base64UrlDecode(partes[0]);
            assinaturaRecebida = Base64UrlDecode(partes[1]);
        }
        catch
        {
            return new TokenValidado(false, Guid.Empty, "Token inválido.");
        }

        var assinaturaEsperada = Assinar(payloadBytes);
        if (!CryptographicOperations.FixedTimeEquals(assinaturaRecebida, assinaturaEsperada))
            return new TokenValidado(false, Guid.Empty, "Token inválido.");

        Payload? payload;
        try
        {
            payload = JsonSerializer.Deserialize<Payload>(payloadBytes);
        }
        catch
        {
            return new TokenValidado(false, Guid.Empty, "Token inválido.");
        }

        if (payload is null)
            return new TokenValidado(false, Guid.Empty, "Token inválido.");

        var tipoEsperadoTexto = tipoEsperado == TipoToken.Acesso ? "acesso" : "reset";
        if (payload.typ != tipoEsperadoTexto)
            return new TokenValidado(false, Guid.Empty, "Token de tipo inválido para esta operação.");

        if (DateTimeOffset.UtcNow.ToUnixTimeSeconds() > payload.exp)
            return new TokenValidado(false, Guid.Empty, "Token expirado.");

        if (!Guid.TryParse(payload.sub, out var usuarioId))
            return new TokenValidado(false, Guid.Empty, "Token inválido.");

        return new TokenValidado(true, usuarioId, null);
    }

    private string GerarToken(Guid usuarioId, string? email, string tipo, TimeSpan duracao)
    {
        var exp = DateTimeOffset.UtcNow.Add(duracao).ToUnixTimeSeconds();
        var payload = new Payload(usuarioId.ToString(), email, tipo, exp);
        var payloadBytes = JsonSerializer.SerializeToUtf8Bytes(payload);
        var assinatura = Assinar(payloadBytes);

        return $"{Base64UrlEncode(payloadBytes)}.{Base64UrlEncode(assinatura)}";
    }

    private byte[] Assinar(byte[] dados)
    {
        using var hmac = new HMACSHA256(_chave);
        return hmac.ComputeHash(dados);
    }

    private static string Base64UrlEncode(byte[] bytes) =>
        Convert.ToBase64String(bytes)
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');

    private static byte[] Base64UrlDecode(string texto)
    {
        var s = texto.Replace('-', '+').Replace('_', '/');
        switch (s.Length % 4)
        {
            case 2: s += "=="; break;
            case 3: s += "="; break;
        }
        return Convert.FromBase64String(s);
    }
}
