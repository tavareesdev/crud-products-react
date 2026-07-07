# CRUD Produtos

Sistema de cadastro de produtos com Clean Architecture, DDD, SOLID — Backend .NET 8 + Frontend React.

## Stack

| Camada      | Tecnologia |
|-------------|------------|
| Backend     | .NET 8, C# 10, ASP.NET Core |
| ORM         | Entity Framework Core 8 |
| Banco       | SQLite |
| Documentação| Swagger / OpenAPI |
| Frontend    | React 18, Vite, TypeScript |
| Notificações| react-hot-toast |

## Arquitetura

```
backend/
  src/
    Domain/          ← Entidades, VOs, Interfaces (incl. ITokenService), Domain Events
    Application/     ← Use Cases (Produtos, Usuarios, Auth), DTOs, Mappings
    Infrastructure/  ← EF Core, SQLite, Repositórios, UoW, TokenService (HMAC)
    WebApi/          ← Controllers (Produtos, Usuarios, Auth), Middleware, DI Extensions
frontend/
  src/
    types/           ← Interfaces TypeScript (produto, usuario, auth)
    services/        ← API service (fetch): produtoService, usuarioService, authService
    hooks/           ← useProdutos, useUsuarios (estado)
    components/      ← Layout, ícones, modais e tabelas de Produtos e Usuários
    pages/           ← LoginPage, EsqueciSenhaPage, RedefinirSenhaPage, HomePage, UsuariosPage
```

## Princípios aplicados

- **DDD**: Aggregate Root (Produto), Value Objects (Preco, Sku), Domain Events
- **Clean Architecture**: dependência sempre de fora pra dentro
- **SOLID**: SRP (Use Cases separados), OCP (interfaces), LSP, ISP, DIP (injeção via interfaces)
- **Result Pattern**: sem exceptions para erros de domínio
- **Unit of Work**: transações explícitas

## Como executar

```powershell
# 1. Setup completo (restaura NuGet + npm install)
.\Iniciar.ps1

# 2. Backend (terminal 1)
cd backend/src/WebApi
dotnet run

# 3. Frontend (terminal 2)
cd frontend
npm run dev
```

## Endpoints da API

| Método | Rota                         | Descrição                          |
|--------|------------------------------|-------------------------------------|
| GET    | /api/produtos                | Listar todos                        |
| GET    | /api/produtos/{id}           | Buscar por ID                       |
| POST   | /api/produtos                | Criar produto                       |
| PUT    | /api/produtos/{id}           | Atualizar produto                   |
| DELETE | /api/produtos/{id}           | Remover produto                     |
| GET    | /api/usuarios                | Listar todos                        |
| GET    | /api/usuarios/{id}           | Buscar por ID                       |
| POST   | /api/usuarios                | Criar usuário                       |
| PUT    | /api/usuarios/{id}           | Atualizar usuário                   |
| PUT    | /api/usuarios/{id}/senha     | Atualizar senha (exige senha atual) |
| DELETE | /api/usuarios/{id}           | Remover usuário                     |
| POST   | /api/auth/login              | Login (retorna token + usuário)     |
| POST   | /api/auth/esqueci-senha      | Solicita token de recuperação       |
| POST   | /api/auth/redefinir-senha    | Redefine a senha usando o token     |

## Autenticação

O login gera um token assinado com HMAC-SHA256 (`Auth:SecretKey` em `appsettings.json`),
armazenado no `localStorage` do navegador e validado pela rota protegida do frontend
(`ProtectedRoute`). **Importante**: troque `Auth:SecretKey` por um valor secreto real antes
de colocar em produção, e considere adicionar o pacote
`Microsoft.AspNetCore.Authentication.JwtBearer` caso queira também proteger os endpoints do
backend com `[Authorize]` (hoje eles ficam abertos, assim como já estava com `/api/produtos`).

### Esqueci minha senha

Como o projeto não tem um serviço de e-mail configurado, o fluxo funciona assim:
1. O usuário informa o e-mail em **Esqueceu a senha?**.
2. O backend gera um token de recuperação válido por 30 minutos.
3. Em ambiente de desenvolvimento, o token é devolvido na própria resposta (tela mostra um
   aviso "Modo desenvolvimento" com o token e um atalho para usá-lo na hora).
4. Em produção, troque essa etapa por um envio real de e-mail com o link
   `/redefinir-senha?token=...`.

## Primeiro acesso

Ainda não há uma tela de "cadastro público" — crie o primeiro usuário direto pelo Swagger
(`POST /api/usuarios`, disponível em `/swagger` quando o backend está rodando) e depois use
esse e-mail/senha para logar. A partir daí, novos usuários podem ser criados pela tela
**Usuários** dentro do sistema.

