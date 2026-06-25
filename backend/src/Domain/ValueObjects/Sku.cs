namespace Domain.ValueObjects;

public sealed class Sku
{
    public string Valor { get; }

    private Sku() { }
    private Sku(string valor) => Valor = valor;

    public static Result<Sku> Criar(string valor)
    {
        if (string.IsNullOrWhiteSpace(valor))
            return Result<Sku>.Failure("SKU não pode ser vazio.");
        if (valor.Length > 50)
            return Result<Sku>.Failure("SKU deve ter no máximo 50 caracteres.");
        return Result<Sku>.Success(new Sku(valor.ToUpperInvariant().Trim()));
    }

    public override string ToString() => Valor;
    public static implicit operator string(Sku s) => s.Valor;
}
