using Domain.Events;

namespace Domain.Entities;

public abstract class EntidadeBase
{
    public Guid Id { get; protected set; } = Guid.NewGuid();
    public DateTime CriadoEm { get; protected set; } = DateTime.UtcNow;
    public DateTime? AtualizadoEm { get; protected set; }

    private readonly List<DomainEvent> _eventos = new();
    public IReadOnlyList<DomainEvent> Eventos => _eventos.AsReadOnly();

    protected void AdicionarEvento(DomainEvent evento) => _eventos.Add(evento);
    public void LimparEventos() => _eventos.Clear();
}
