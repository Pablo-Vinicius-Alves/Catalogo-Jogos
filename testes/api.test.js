import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import app from "../app.js";
import conexao from "../db.js";

let servidor;
let base;

async function req(metodo, caminho, corpo) {
    const opcoes = { method: metodo, headers: {} };
    if (corpo !== undefined) {
        opcoes.headers["Content-Type"] = "application/json";
        opcoes.body = typeof corpo === "string" ? corpo : JSON.stringify(corpo);
    }
    const resposta = await fetch(base + caminho, opcoes);
    return { status: resposta.status, corpo: await resposta.json() };
}

before(async () => {
    await new Promise((ok) => { servidor = app.listen(0, ok); });
    base = `http://localhost:${servidor.address().port}`;
});

after(async () => {
    await new Promise((ok) => servidor.close(ok));
    conexao.end();
});

describe("DESENVOLVEDORES (5 endpoints)", () => {
    let estudioId, id;

    before(async () => {
        estudioId = (await req("POST", "/estudios", { nome: "Studio Dev", pais: "Brasil" })).corpo.id;
    });
    after(async () => {
        if (id) await req("DELETE", `/desenvolvedores/${id}`);
        await req("DELETE", `/estudios/${estudioId}`);
    });

    test("POST /desenvolvedores -> 201", async () => {
        const r = await req("POST", "/desenvolvedores",
            { nickname: "dev_teste", nome: "Dev Teste", estudio_id: estudioId });
        assert.equal(r.status, 201);
        id = r.corpo.id;
    });
    test("POST /desenvolvedores com nickname repetido -> 409", async () => {
        const r = await req("POST", "/desenvolvedores",
            { nickname: "dev_teste", nome: "Outro", estudio_id: estudioId });
        assert.equal(r.status, 409);
    });
    test("POST /desenvolvedores com estudio inexistente -> 400", async () => {
        const r = await req("POST", "/desenvolvedores",
            { nickname: "fantasma", nome: "Sem Estudio", estudio_id: 999999 });
        assert.equal(r.status, 400);
    });
    test("POST /desenvolvedores com estudio_id como texto -> 400", async () => {
        const r = await req("POST", "/desenvolvedores",
            { nickname: "x1", nome: "X", estudio_id: "1" });
        assert.equal(r.status, 400);
    });
    test("GET /desenvolvedores -> 200 (traz nome do estudio)", async () => {
        const r = await req("GET", "/desenvolvedores");
        assert.equal(r.status, 200);
        assert.ok(r.corpo.some((d) => d.nickname === "dev_teste" && d.estudio === "Studio Dev"));
    });
    test("GET /desenvolvedores/:id -> 200", async () => {
        const r = await req("GET", `/desenvolvedores/${id}`);
        assert.equal(r.status, 200);
        assert.equal(r.corpo.nickname, "dev_teste");
    });
    test("GET /desenvolvedores/999999 -> 404", async () => {
        assert.equal((await req("GET", "/desenvolvedores/999999")).status, 404);
    });
    test("PUT /desenvolvedores/:id -> 200", async () => {
        const r = await req("PUT", `/desenvolvedores/${id}`,
            { nickname: "dev_teste", nome: "Dev Atualizado", estudio_id: estudioId });
        assert.equal(r.status, 200);
        assert.equal((await req("GET", `/desenvolvedores/${id}`)).corpo.nome, "Dev Atualizado");
    });
    test("PUT /desenvolvedores/999999 -> 404", async () => {
        const r = await req("PUT", "/desenvolvedores/999999",
            { nickname: "n", nome: "N", estudio_id: estudioId });
        assert.equal(r.status, 404);
    });
    test("DELETE /estudios/:id com desenvolvedor vinculado -> 409", async () => {
        assert.equal((await req("DELETE", `/estudios/${estudioId}`)).status, 409);
    });
    test("DELETE /desenvolvedores/:id -> 200", async () => {
        assert.equal((await req("DELETE", `/desenvolvedores/${id}`)).status, 200);
        id = null;
    });
    test("DELETE /desenvolvedores/999999 -> 404", async () => {
        assert.equal((await req("DELETE", "/desenvolvedores/999999")).status, 404);
    });
});

describe("JOGOS (5 endpoints)", () => {
    let estudioId, id;

    before(async () => {
        estudioId = (await req("POST", "/estudios", { nome: "Studio Jogos", pais: "Brasil" })).corpo.id;
    });
    after(async () => {
        if (id) await req("DELETE", `/jogos/${id}`);
        await req("DELETE", `/estudios/${estudioId}`);
    });

    const jogo = () => ({ titulo: "Jogo Teste", genero: "Ação", ano_lancamento: 2020, estudio_id: estudioId });

    test("POST /jogos -> 201", async () => {
        const r = await req("POST", "/jogos", jogo());
        assert.equal(r.status, 201);
        id = r.corpo.id;
    });
    test("POST /jogos com ano invalido -> 400", async () => {
        assert.equal((await req("POST", "/jogos", { ...jogo(), ano_lancamento: 1800 })).status, 400);
    });
    test("POST /jogos com estudio inexistente -> 400", async () => {
        assert.equal((await req("POST", "/jogos", { ...jogo(), estudio_id: 999999 })).status, 400);
    });
    test("POST /jogos sem titulo -> 400", async () => {
        assert.equal((await req("POST", "/jogos", { ...jogo(), titulo: undefined })).status, 400);
    });
    test("GET /jogos -> 200 (traz nome do estudio)", async () => {
        const r = await req("GET", "/jogos");
        assert.equal(r.status, 200);
        assert.ok(r.corpo.some((j) => j.id === id && j.estudio === "Studio Jogos"));
    });
    test("GET /jogos/:id -> 200", async () => {
        const r = await req("GET", `/jogos/${id}`);
        assert.equal(r.status, 200);
        assert.equal(r.corpo.titulo, "Jogo Teste");
    });
    test("GET /jogos/999999 -> 404", async () => {
        assert.equal((await req("GET", "/jogos/999999")).status, 404);
    });
    test("PUT /jogos/:id -> 200", async () => {
        const r = await req("PUT", `/jogos/${id}`, { ...jogo(), titulo: "Jogo Atualizado", ano_lancamento: 2021 });
        assert.equal(r.status, 200);
        const c = (await req("GET", `/jogos/${id}`)).corpo;
        assert.equal(c.titulo, "Jogo Atualizado");
        assert.equal(c.ano_lancamento, 2021);
    });
    test("PUT /jogos/999999 -> 404", async () => {
        assert.equal((await req("PUT", "/jogos/999999", jogo())).status, 404);
    });
    test("DELETE /jogos/:id -> 200", async () => {
        assert.equal((await req("DELETE", `/jogos/${id}`)).status, 200);
        id = null;
    });
    test("DELETE /jogos/999999 -> 404", async () => {
        assert.equal((await req("DELETE", "/jogos/999999")).status, 404);
    });
});

describe("Rotas gerais", () => {
    test("GET /rota-inexistente -> 404", async () => {
        assert.equal((await req("GET", "/rota-inexistente")).status, 404);
    });
});
