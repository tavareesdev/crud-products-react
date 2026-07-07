using Domain.Events;
using Domain.ValueObjects;
using BCrypt.Net;

namespace Domain.Entities;

public sealed class Usuario : EntidadeBase
{
    public string Nome { get; private set; } = string.Empty;
    public string Email { get; private set; } = null!;
    public Cpf Documento { get; private set; } = null!;
    private string SenhaHash { get; set; } = null!;
    public DateTime CriadoEm { get; private set; }
    public DateTime? AtualizadoEm { get; private set; }
    public bool Ativo { get; private set; } = true;

    private Usuario() { }

    public static Result<Usuario> Criar(
        string nome, 
        string email, 
        string senha, 
        string documento)
    {
        // 1. Valida nome
        if (string.IsNullOrWhiteSpace(nome))
            return Result<Usuario>.Failure("Nome é obrigatório.");
        
        if (nome.Length > 200)
            return Result<Usuario>.Failure("Nome deve ter no máximo 200 caracteres.");

        // 2. Valida email
        if (string.IsNullOrWhiteSpace(email))
            return Result<Usuario>.Failure("Email é obrigatório.");
        
        if (!EmailValidator.IsValid(email))
            return Result<Usuario>.Failure("Email inválido.");

        // 3. Valida senha
        if (string.IsNullOrWhiteSpace(senha))
            return Result<Usuario>.Failure("Senha é obrigatória.");
        
        var senhaValidation = ValidarSenha(senha);
        if (!senhaValidation.Sucesso)
            return Result<Usuario>.Failure(senhaValidation.Erro);

        // 4. Valida CPF (cria o Value Object)
        var cpfResult = Cpf.Create(documento);
        if (!cpfResult.Sucesso)
            return Result<Usuario>.Failure(cpfResult.Erro);

        // 5. Cria o usuário
        var usuario = new Usuario
        {
            Nome = nome.Trim(),
            Email = email.Trim().ToLower(),
            Documento = cpfResult.Dado!,
            SenhaHash = BCrypt.Net.BCrypt.HashPassword(senha),
            CriadoEm = DateTime.UtcNow,
            Ativo = true
        };

        // 6. Adiciona evento
        usuario.AdicionarEvento(new UsuarioCriadoEvent(usuario.Id, usuario.Nome));
        
        return Result<Usuario>.Success(usuario);
    }

    public Result<Usuario> Atualizar(
        string nome, string email, Cpf documento)
    {
        if (string.IsNullOrWhiteSpace(nome))
            return Result<Usuario>.Failure("Nome é obrigatório.");
        if (string.IsNullOrWhiteSpace(email))
            return Result<Usuario>.Failure("Email é obrigatório.");

        if (documento is null)
            return Result<Usuario>.Failure("Documento é obrigatório.");

        Nome = nome.Trim();
        Email = email.Trim();
        Documento = documento;
        AtualizadoEm = DateTime.UtcNow;

        AdicionarEvento(new UsuarioAtualizadoEvent(Id));
        return Result<Usuario>.Success(this);
    }

    public Result<Usuario> AtualizarSenha(string senhaAtual, string novaSenha)
    {
        if (!VerificarSenha(senhaAtual))
            return Result<Usuario>.Failure("Senha atual incorreta.");

        var senhaValidation = ValidarSenha(novaSenha);
        if (!senhaValidation.Sucesso)
            return Result<Usuario>.Failure(senhaValidation.Erro);

        SenhaHash = BCrypt.Net.BCrypt.HashPassword(novaSenha);
        AtualizadoEm = DateTime.UtcNow;

        AdicionarEvento(new SenhaAlteradaEvent(Id, DateTime.UtcNow));
        
        return Result<Usuario>.Success(this);
    }

    public bool VerificarSenha(string senha)
    {
        return BCrypt.Net.BCrypt.Verify(senha, SenhaHash);
    }

    /// <summary>
    /// Redefine a senha sem exigir a senha atual (usado no fluxo de "esqueci minha senha",
    /// após a validação do token de recuperação).
    /// </summary>
    public Result<Usuario> RedefinirSenha(string novaSenha)
    {
        var senhaValidation = ValidarSenha(novaSenha);
        if (!senhaValidation.Sucesso)
            return Result<Usuario>.Failure(senhaValidation.Erro);

        SenhaHash = BCrypt.Net.BCrypt.HashPassword(novaSenha);
        AtualizadoEm = DateTime.UtcNow;

        AdicionarEvento(new SenhaAlteradaEvent(Id, DateTime.UtcNow));

        return Result<Usuario>.Success(this);
    }

    private static Result<string> ValidarSenha(string senha)
    {
        if (string.IsNullOrWhiteSpace(senha))
            return Result<string>.Failure("Senha é obrigatória.");
        
        if (senha.Length < 8)
            return Result<string>.Failure("Senha deve ter no mínimo 8 caracteres.");
        
        if (senha.Length > 100)
            return Result<string>.Failure("Senha deve ter no máximo 100 caracteres.");
        
        if (!senha.Any(char.IsUpper))
            return Result<string>.Failure("Senha deve conter pelo menos uma letra maiúscula.");
        
        if (!senha.Any(char.IsLower))
            return Result<string>.Failure("Senha deve conter pelo menos uma letra minúscula.");
        
        if (!senha.Any(char.IsDigit))
            return Result<string>.Failure("Senha deve conter pelo menos um número.");
        
        if (!senha.Any(c => !char.IsLetterOrDigit(c)))
            return Result<string>.Failure("Senha deve conter pelo menos um caractere especial.");

        return Result<string>.Success(senha);
    }

    public void Desativar()
    {
        Ativo = false;
        AtualizadoEm = DateTime.UtcNow;
        AdicionarEvento(new UsuarioRemovidoEvent(Id));
    }
}