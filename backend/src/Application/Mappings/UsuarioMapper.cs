using Application.DTOs;
using Domain.Entities;

namespace Application.Mappings;

public static class UsuarioMapper
{
    public static UsuarioDto ToDto(this Usuario u) => new(
        u.Id, u.Nome, u.Email, u.Documento, u.Ativo, u.CriadoEm, u.AtualizadoEm);
}
