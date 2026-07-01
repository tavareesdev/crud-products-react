namespace Application.DTOs;

public record UsuarioDto(
    Guid Id,
    string Nome,
    string Email,
    string Documento,
    bool Ativo,
    DateTime CriadoEm,
    DateTime? AtualizadoEm);

public record CriarUsuarioDto(
    string Nome,
    string Email,
    string Documento,
    string Senha);

public record AtualizarUsuarioDto(
    string Nome,
    string Email,
    string Documento);