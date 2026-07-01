using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CriarTabelasProdutoEUsuario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Nome = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 256, nullable: false),
                    Documento = table.Column<string>(type: "TEXT", maxLength: 11, nullable: false),
                    SenhaHash = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Documento",
                table: "Usuarios",
                column: "Documento",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
