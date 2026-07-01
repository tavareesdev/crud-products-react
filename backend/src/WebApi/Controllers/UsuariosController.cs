using Application.DTOs;
using Application.UseCases.Usuarios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class UsuariosController(
    ListarUsuariosUseCase listar,
    ObterUsuarioUseCase obter,
    CriarUsuarioUseCase criar,
    AtualizarUsuarioUseCase atualizar,
    RemoverUsuarioUseCase remover,
    AtualizarSenhaUseCase atualizarSenha)
    : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<UsuarioDto>), 200)]
    public async Task<IActionResult> Listar(CancellationToken ct)
        => Ok(await listar.ExecutarAsync(ct));

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(UsuarioDto), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> ObterPorId(Guid id, CancellationToken ct)
    {
        var dto = await obter.ExecutarAsync(id, ct);
        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpPost]
    [ProducesResponseType(typeof(UsuarioDto), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Criar([FromBody] CriarUsuarioDto dto, CancellationToken ct)
    {
        var (resultado, erro) = await criar.ExecutarAsync(dto, ct);
        if (erro is not null) return BadRequest(new { erro });
        return CreatedAtAction(nameof(ObterPorId), new { id = resultado!.Id }, resultado);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(UsuarioDto), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Atualizar(Guid id, [FromBody] AtualizarUsuarioDto dto, CancellationToken ct)
    {
        var (resultado, erro) = await atualizar.ExecutarAsync(id, dto, ct);
        if (erro is not null)
            return erro.Contains("não encontrado") ? NotFound(new { erro }) : BadRequest(new { erro });
        return Ok(resultado);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Remover(Guid id, CancellationToken ct)
    {
        var erro = await remover.ExecutarAsync(id, ct);
        return erro is not null ? NotFound(new { erro }) : NoContent();
    }

    [HttpPut("{id:guid}/senha")]
    [ProducesResponseType(typeof(UsuarioDto), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> AtualizarSenha(
        Guid id, 
        [FromBody] AtualizarSenhaDto dto, 
        CancellationToken ct)
    {
        // Valida se é o próprio usuário (opcional)
        // var usuarioIdLogado = ObterUsuarioIdLogado();
        // if (usuarioIdLogado != id)
        //     return Forbid("Você só pode alterar sua própria senha.");

        var (resultado, erro) = await atualizarSenha.ExecutarAsync(id, dto, ct);
        
        if (erro is not null)
        {
            return erro switch
            {
                "Usuário não encontrado." => NotFound(new { erro }),
                _ => BadRequest(new { erro })
            };
        }

        return Ok(new
        {
            Mensagem = "Senha atualizada com sucesso!",
            Usuario = resultado
        });
    }

    private Guid ObterUsuarioIdLogado()
    {
        var userIdClaim = User.FindFirst("nameid")?.Value 
                          ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
            return Guid.Empty;

        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }
}