using System.Text.RegularExpressions;

namespace Domain.ValueObjects;

public static class EmailValidator
{
    // Regex mais completo para validação de email
    private static readonly Regex EmailRegex = new(
        @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase
    );

    public static bool IsValid(string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return false;

        // Remove espaços e normaliza
        email = email.Trim();

        // Verifica tamanho máximo (256 é padrão)
        if (email.Length > 256)
            return false;

        return EmailRegex.IsMatch(email);
    }
}