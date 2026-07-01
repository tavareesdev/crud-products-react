using Application.DTOs;
using Application.Mappings;
using Domain.Interfaces;

namespace Application.UseCases.Usuarios;

public sealed class AtualizarSenhaUseCase(
    IUsuarioRepository repository,
    IUnitOfWork unitOfWork)
{
    public async Task<(UsuarioDto? Dto, string? Erro)> ExecutarAsync(
        Guid id, AtualizarSenhaDto dto, CancellationToken ct = default)
    {
        // 1. Busca usuário
        var usuario = await repository.ObterPorIdAsync(id, ct);
        if (usuario is null) 
            return (null, "Usuário não encontrado.");

        // 2. Valida confirmação de senha
        if (dto.NovaSenha != dto.ConfirmarNovaSenha)
            return (null, "A confirmação da nova senha não coincide.");

        // 3. Tenta atualizar (valida senha atual + complexidade)
        var result = usuario.AtualizarSenha(dto.SenhaAtual, dto.NovaSenha);
        if (!result.Sucesso) 
            return (null, result.Erro);

        // 4. Persiste
        await repository.AtualizarAsync(usuario, ct);
        await unitOfWork.CommitAsync(ct);

        // 5. Retorna o DTO atualizado
        return (usuario.ToDto(), null);
    }
}