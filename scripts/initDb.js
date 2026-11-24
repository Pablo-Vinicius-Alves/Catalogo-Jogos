import fs from "node:fs";
import mysql from "mysql2/promise";
import "dotenv/config";

const sql = fs.readFileSync(new URL("../sql/schema.sql", import.meta.url), "utf8");

const conexao = await mysql.createConnection({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    multipleStatements: true
});

await conexao.query(sql);
await conexao.end();
console.log("Banco 'catalogo_jogos' criado e populado com sucesso.");
