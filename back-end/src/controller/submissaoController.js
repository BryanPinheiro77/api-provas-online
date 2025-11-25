import { Router } from 'express';
import * as provaRepo from '../repository/provaRepository.js';
import * as subRepo from '../repository/submissaoRepository.js';
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();

// aluno responde prova
endpoints.post(
  '/provas/:id/responder',
  getAuthentication(user => user.tipo === "aluno"),
  async (req, resp) => {
    try {
      const provaId = req.params.id;
      const { alunoId, respostas } = req.body;

      if (!alunoId || !respostas)
        return resp.status(400).send({ erro: 'Aluno e respostas são obrigatórios.' });

      const prova = await provaRepo.buscarProvaPorId(provaId);
      if (!prova)
        return resp.status(404).send({ erro: 'Prova não encontrada' });

      const linhas = await provaRepo.listarPerguntasComOpcoes(provaId);

      const gabarito = {};
      const perguntasSet = new Set();

      for (const row of linhas) {
        perguntasSet.add(row.perguntaId);
        if (row.opcaoCorreta) gabarito[row.perguntaId] = row.opcaoId;
      }

      const totalQuestoes = perguntasSet.size;
      let acertos = 0;

      for (const r of respostas) {
        if (gabarito[r.perguntaId] === r.opcaoId) acertos++;
      }

      const nota = Number(((acertos / totalQuestoes) * 10).toFixed(2));

      const submissaoId = await subRepo.criarSubmissao(
        provaId,
        alunoId,
        nota,
        totalQuestoes,
        acertos
      );

      for (const r of respostas) {
        await subRepo.inserirRespostaSubmissao(
          submissaoId,
          r.perguntaId,
          r.opcaoId,
          gabarito[r.perguntaId] === r.opcaoId
        );
      }

      resp.send({ submissaoId, nota, totalQuestoes, acertos });

    } catch (err) {
      console.log(err);
      resp.status(500).send({ erro: 'Erro ao responder prova' });
    }
  }
);

// listar submissões do aluno
endpoints.get(
  '/alunos/:id/submissoes',
  getAuthentication(user => user.tipo === "aluno"),
  async (req, resp) => {
    try {
      const alunoId = req.params.id;
      const lista = await subRepo.listarSubmissoesPorAluno(alunoId);
      resp.send(lista);
    } catch (err) {
      resp.status(500).send({ erro: 'Erro ao listar submissões' });
    }
  }
);

// detalhes da submissão
endpoints.get(
  '/submissoes/:id',
  getAuthentication(user => user.tipo === "aluno"),
  async (req, resp) => {
    try {
      const id = req.params.id;
      const sub = await subRepo.buscarSubmissaoPorId(id);

      if (!sub)
        return resp.status(404).send({ erro: 'Submissão não encontrada' });

      resp.send(sub);

    } catch (err) {
      resp.status(500).send({ erro: 'Erro ao buscar submissão' });
    }
  }
);

export default endpoints;
