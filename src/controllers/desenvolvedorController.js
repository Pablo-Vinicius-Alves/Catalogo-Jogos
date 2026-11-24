import * as desenvolvedorModel from "../models/desenvolvedorModel.js";
import { textoValido, inteiroPositivo } from "../utils/validacoes.js";

const MSG_INVALIDO =
    "Informe nickname (até 50 caracteres), nome (até 100) e estudio_id (inteiro positivo)";

function lerDados(body) {
    const { nickname, nome, estudio_id } = body ?? {};
    if (!textoValido(nickname, 50) || !textoValido(nome, 100) || !inteiroPositivo(estudio_id)) {
        return null;
    }
    return { nickname: nickname.trim(), nome: nome.trim(), estudio_id };
}

export function listar(req, res, next) {
    desenvolvedorModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
}

export function buscarPorId(req, res, next) {
    desenvolvedorModel.buscarPorId(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Desenvolvedor não encontrado" });
        }
        return res.status(200).json(resultado[0]);
    });
}

export function criar(req, res, next) {
    const dados = lerDados(req.body);
    if (!dados) return res.status(400).json({ erro: MSG_INVALIDO });

    desenvolvedorModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Desenvolvedor cadastrado com sucesso",
            id: resultado.insertId
        });
    });
}

export function atualizar(req, res, next) {
    const dados = lerDados(req.body);
    if (!dados) return res.status(400).json({ erro: MSG_INVALIDO });

    desenvolvedorModel.buscarPorId(req.id, (erro, registros) => {
        if (erro) return next(erro);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Desenvolvedor não encontrado" });
        }
        desenvolvedorModel.atualizar(req.id, dados, (erro) => {
            if (erro) return next(erro);
            return res.status(200).json({ mensagem: "Desenvolvedor atualizado com sucesso" });
        });
    });
}

export function excluir(req, res, next) {
    desenvolvedorModel.excluir(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Desenvolvedor não encontrado" });
        }
        return res.status(200).json({ mensagem: "Desenvolvedor excluído com sucesso" });
    });
}
