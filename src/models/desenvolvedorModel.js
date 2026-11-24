import conexao from "../../db.js";

export function listar(callback) {
    const sql = `SELECT d.id, d.nickname, d.nome, d.estudio_id, e.nome AS estudio
                 FROM desenvolvedores d
                 JOIN estudios e ON e.id = d.estudio_id
                 ORDER BY d.id`;
    conexao.query(sql, callback);
}

export function buscarPorId(id, callback) {
    const sql = "SELECT * FROM desenvolvedores WHERE id = ?";
    conexao.query(sql, [id], callback);
}

export function criar(dados, callback) {
    const sql = "INSERT INTO desenvolvedores (nickname, nome, estudio_id) VALUES (?, ?, ?)";
    conexao.query(sql, [dados.nickname, dados.nome, dados.estudio_id], callback);
}

export function atualizar(id, dados, callback) {
    const sql = "UPDATE desenvolvedores SET nickname = ?, nome = ?, estudio_id = ? WHERE id = ?";
    conexao.query(sql, [dados.nickname, dados.nome, dados.estudio_id, id], callback);
}

export function excluir(id, callback) {
    const sql = "DELETE FROM desenvolvedores WHERE id = ?";
    conexao.query(sql, [id], callback);
}
