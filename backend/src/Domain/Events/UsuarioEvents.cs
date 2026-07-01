namespace Domain.Events;

public sealed class UsuarioCriadoEvent : DomainEvent
{
    public Guid UsuarioId { get; }
    public string Nome { get; }
    public UsuarioCriadoEvent(Guid usuarioId, string nome) { UsuarioId = usuarioId; Nome = nome; }
}

public sealed class UsuarioAtualizadoEvent : DomainEvent
{
    public Guid UsuarioId { get; }
    public UsuarioAtualizadoEvent(Guid usuarioId) => UsuarioId = usuarioId;
}

public sealed class UsuarioRemovidoEvent : DomainEvent
{
    public Guid UsuarioId { get; }
    public UsuarioRemovidoEvent(Guid usuarioId) => UsuarioId = usuarioId;
}
