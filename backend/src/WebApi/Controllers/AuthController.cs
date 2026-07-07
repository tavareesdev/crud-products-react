using Application.DTOs;
using Application.UseCases.Auth;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(
    LoginUseCase login,
    EsqueciSenhaUseCase esqueciSenha,
    RedefinirSenhaUseCase redefinirSenha,
    IWebHostEnvironment env)
    : ControllerBase
{
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponseDto), 200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> Login([FromBody] LoginDto dto, CancellationToken ct)
    {
        var (resultado, erro) = await login.ExecutarAsync(dto, ct);
        if (erro is not null) return Unauthorized(new { erro });
        return Ok(resultado);
    }

    [HttpPost("esqueci-senha")]
    [ProducesResponseType(200)]
    public async Task<IActionResult> EsqueciSenha([FromBody] EsqueciSenhaDto dto, CancellationToken ct)
    {
        var token = await esqueciSenha.ExecutarAsync(dto, ct);

        // Resposta sempre genérica: não revelamos se o e-mail existe na base.
        var resposta = new Dictionary<string, object?>
        {
            ["mensagem"] = "Se o e-mail informado estiver cadastrado, enviaremos as instruções de recuperação."
        };

        // Não há serviço de e-mail configurado neste projeto. Em ambiente de
        // desenvolvimento, devolvemos o token na própria resposta para permitir
        // testar o fluxo de ponta a ponta. Em produção, isso deve ser removido e
        // o token deve ser enviado por e-mail ao usuário.
        if (env.IsDevelopment() && token is not null)
        {
            resposta["tokenDev"] = token;
        }

        return Ok(resposta);
    }

    [HttpPost("redefinir-senha")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> RedefinirSenha([FromBody] RedefinirSenhaDto dto, CancellationToken ct)
    {
        var erro = await redefinirSenha.ExecutarAsync(dto, ct);
        if (erro is not null) return BadRequest(new { erro });
        return Ok(new { mensagem = "Senha redefinida com sucesso." });
    }
}
