using System.Text.RegularExpressions;

namespace Domain.ValueObjects;

public sealed class Cpf : IEquatable<Cpf>
{
    public string Value { get; }

    private Cpf(string value)
    {
        Value = value;
    }

    public static Result<Cpf> Create(string? cpf)
    {
        if (string.IsNullOrWhiteSpace(cpf))
            return Result<Cpf>.Failure("CPF é obrigatório.");

        string numeros = Regex.Replace(cpf, @"[^\d]", "");

        if (numeros.Length != 11)
            return Result<Cpf>.Failure("CPF deve ter 11 dígitos.");

        if (!IsValid(numeros))
            return Result<Cpf>.Failure("CPF inválido.");

        return Result<Cpf>.Success(new Cpf(numeros));
    }

    public static bool IsValid(string? cpf)
    {
        if (string.IsNullOrWhiteSpace(cpf))
            return false;

        string numeros = Regex.Replace(cpf, @"[^\d]", "");

        if (numeros.Length != 11)
            return false;

        if (numeros.Distinct().Count() == 1)
            return false;

        int soma = 0;
        for (int i = 0; i < 9; i++)
            soma += (numeros[i] - '0') * (10 - i);

        int primeiroDigito = 11 - (soma % 11);
        if (primeiroDigito >= 10) primeiroDigito = 0;

        if (primeiroDigito != (numeros[9] - '0'))
            return false;

        soma = 0;
        for (int i = 0; i < 10; i++)
            soma += (numeros[i] - '0') * (11 - i);

        int segundoDigito = 11 - (soma % 11);
        if (segundoDigito >= 10) segundoDigito = 0;

        return segundoDigito == (numeros[10] - '0');
    }

    public string Format() => 
        Convert.ToUInt64(Value).ToString(@"000\.000\.000\-00");

    public static implicit operator string(Cpf cpf) => cpf?.Value ?? string.Empty;

    public override string ToString() => Format();

    public bool Equals(Cpf? other) => 
        other is not null && Value == other.Value;

    public override bool Equals(object? obj) => 
        Equals(obj as Cpf);

    public override int GetHashCode() => 
        Value.GetHashCode();
}