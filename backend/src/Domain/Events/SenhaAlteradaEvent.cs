namespace Domain.Events;

public sealed class SenhaAlteradaEvent : DomainEvent
{
    public Guid UsuarioId { get; }
    public DateTime OcorreuEm { get; }
    public string Tipo => "SenhaAlterada";

    public SenhaAlteradaEvent(Guid usuarioId, DateTime ocorreuEm)
    {
        UsuarioId = usuarioId;
        OcorreuEm = ocorreuEm;
    }
}