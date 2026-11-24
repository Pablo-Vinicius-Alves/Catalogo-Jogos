import conexao from "../../db.js";

export function listar(callback) {
    const sql = `SELECT j.id, j.titulo, j.genero, j.ano_lancamento, j.estudio_id, e.nome AS estudio
                 FROM jogos j
                 JOIN estudios e ON e.id = j.estudio_id
                 ORDER BY j.id`;
    conexao.query(sql, callback);
}

export function buscarPorId(id, callback) {
    const sql = "SELECT * FROM jogos WHERE id = ?";
    conexao.query(sql, [id], callback);
}

export function criar(dados, callback) {
    const sql = "INSERT INTO jogos (titulo, genero, ano_lancamento, estudio_id) VALUES (?, ?, ?, ?)";
    conexao.query(sql, [dados.titulo, dados.genero, dados.ano_lancamento, dados.estudio_id], callback);
}

export function atualizar(id, dados, callback) {
    const sql = "UPDATE jogos SET titulo = ?, genero = ?, ano_lancamento = ?, estudio_id = ? WHERE id = ?";
    conexao.query(sql, [dados.titulo, dados.genero, dados.ano_lancamento, dados.estudio_id, id], callback);
}

export function excluir(id, callback) {
    const sql = "DELETE FROM jogos WHERE id = ?";
    conexao.query(sql, [id], callback);
}
