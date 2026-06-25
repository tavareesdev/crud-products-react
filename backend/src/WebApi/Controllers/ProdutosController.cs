using Application.DTOs;
using Application.UseCases.Produtos;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ProdutosController(
    ListarProdutosUseCase listar,
    ObterProdutoUseCase obter,
    CriarProdutoUseCase criar,
    AtualizarProdutoUseCase atualizar,
    RemoverProdutoUseCase remover) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ProdutoDto>), 200)]
    public async Task<IActionResult> Listar(CancellationToken ct)
        => Ok(await listar.ExecutarAsync(ct));

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ProdutoDto), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> ObterPorId(Guid id, CancellationToken ct)
    {
        var dto = await obter.ExecutarAsync(id, ct);
        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ProdutoDto), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Criar([FromBody] CriarProdutoDto dto, CancellationToken ct)
    {
        var (resultado, erro) = await criar.ExecutarAsync(dto, ct);
        if (erro is not null) return BadRequest(new { erro });
        return CreatedAtAction(nameof(ObterPorId), new { id = resultado!.Id }, resultado);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ProdutoDto), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Atualizar(Guid id, [FromBody] AtualizarProdutoDto dto, CancellationToken ct)
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
}
