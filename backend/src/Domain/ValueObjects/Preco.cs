namespace Domain.ValueObjects;

public sealed class Preco
{
    public decimal Valor { get; }

    private Preco() { }
    private Preco(decimal valor) => Valor = valor;

    public static Result<Preco> Criar(decimal valor)
    {
        if (valor < 0)
            return Result<Preco>.Failure("Preço não pode ser negativo.");
        return Result<Preco>.Success(new Preco(valor));
    }

    public override string ToString() => Valor.ToString("C2");
    public static implicit operator decimal(Preco p) => p.Valor;
}
