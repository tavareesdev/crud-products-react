namespace Domain.ValueObjects;

public class Result<T>
{
    public bool Sucesso { get; }
    public T? Dado { get; }
    public string? Erro { get; }

    private Result(bool sucesso, T? dado, string? erro)
    {
        Sucesso = sucesso;
        Dado = dado;
        Erro = erro;
    }

    public static Result<T> Success(T dado) => new(true, dado, null);
    public static Result<T> Failure(string erro) => new(false, default, erro);
}
