import * as jogoModel from "../models/jogoModel.js";
import { textoValido, inteiroPositivo } from "../utils/validacoes.js";

const ANO_MINIMO = 1950;
const MSG_INVALIDO =
    "Informe titulo (até 120 caracteres), genero (até 50), ano_lancamento (inteiro a partir de 1950) e estudio_id (inteiro positivo)";

function lerDados(body) {
    const { titulo, genero, ano_lancamento, estudio_id } = body ?? {};
    const anoMaximo = new Date().getFullYear() + 5;
    const anoOk = inteiroPositivo(ano_lancamento)
        && ano_lancamento >= ANO_MINIMO
        && ano_lancamento <= anoMaximo;

    if (!textoValido(titulo, 120) || !textoValido(genero, 50) || !anoOk || !inteiroPositivo(estudio_id)) {
        return null;
    }
    return { titulo: titulo.trim(), genero: genero.trim(), ano_lancamento, estudio_id };
}

export function listar(req, res, next) {
    jogoModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
}

export function buscarPorId(req, res, next) {
    jogoModel.buscarPorId(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Jogo não encontrado" });
        }
        return res.status(200).json(resultado[0]);
    });
}

export function criar(req, res, next) {
    const dados = lerDados(req.body);
    if (!dados) return res.status(400).json({ erro: MSG_INVALIDO });

    jogoModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Jogo cadastrado com sucesso",
            id: resultado.insertId
        });
    });
}

export function atualizar(req, res, next) {
    const dados = lerDados(req.body);
    if (!dados) return res.status(400).json({ erro: MSG_INVALIDO });

    jogoModel.buscarPorId(req.id, (erro, registros) => {
        if (erro) return next(erro);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Jogo não encontrado" });
        }
        jogoModel.atualizar(req.id, dados, (erro) => {
            if (erro) return next(erro);
            return res.status(200).json({ mensagem: "Jogo atualizado com sucesso" });
        });
    });
}

export function excluir(req, res, next) {
    jogoModel.excluir(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Jogo não encontrado" });
        }
        return res.status(200).json({ mensagem: "Jogo excluído com sucesso" });
    });
}
