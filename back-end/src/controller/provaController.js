import * as repo from '../repository/provaRepository.js';
import { connection } from '../repository/connection.js';
import { Router } from 'express';
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();

//
// ===================== PROVAS =====================
//

// Criar prova (PROFESSOR)
endpoints.post(
  '/provas',
  getAuthentication(user => user.tipo === "professor"),
  async (req, resp) => {
    try {
      const professorId = req.user.id;
      const { titulo, descricao } = req.body;

      const id = await repo.criarProva(professorId, titulo, descricao);
      resp.send({ novoId: id });
    } catch (err) {
      console.error(err);
      resp.status(500).send({ erro: 'Erro ao criar prova' });
    }
  }
);

// Listar provas para alunos (PÚBLICO)
endpoints.get('/provas/disponiveis', async (_req, resp) => {
  try {
    const lista = await repo.listarProvasAluno();
    resp.send(lista);
  } catch (err) {
    console.error(err);
    resp.status(500).send({ erro: 'Erro ao listar provas disponíveis' });
  }
});

// Listar provas do professor
endpoints.get(
  '/provas/professor/:id',
  getAuthentication(user => user.tipo === "professor"),
  async (req, resp) => {
    try {
      const profId = req.params.id;

      const [rows] = await connection.query(
        `SELECT id, titulo, descricao, data_criacao
           FROM provas
          WHERE professor_id = ?
       ORDER BY data_criacao DESC`,
        [profId]
      );

      resp.send(rows);
    } catch (err) {
      console.error(err);
      resp.status(500).send({ erro: "Erro ao listar provas do professor" });
    }
  }
);

// Buscar prova por ID (para tela de edição)
endpoints.get('/provas/:id', async (req, resp) => {
  try {
    const id = req.params.id;

    const prova = await repo.buscarProvaPorId(id);
    if (!prova)
      return resp.status(404).send({ erro: 'Prova não encontrada' });

    const linhas = await repo.listarPerguntasComOpcoes(id);

    const perguntas = {};

    for (const row of linhas) {
      if (!perguntas[row.perguntaId]) {
        perguntas[row.perguntaId] = {
          id: row.perguntaId,
          texto: row.perguntaTexto,
          opcoes: []
        };
      }

      if (row.opcaoId !== null && row.opcaoId !== undefined) {
        perguntas[row.perguntaId].opcoes.push({
          id: row.opcaoId,
          texto: row.opcaoTexto,
          correta: row.opcaoCorreta === 1
        });
      }
    }

    resp.send({
      id: prova.id,
      titulo: prova.titulo,
      descricao: prova.descricao,
      perguntas: Object.values(perguntas)
    });

  } catch (err) {
    console.error(err);
    resp.status(500).send({ erro: 'Erro ao buscar prova' });
  }
});

// Atualizar prova
endpoints.put(
  '/provas/:id',
  getAuthentication(user => user.tipo === "professor"),
  async (req, resp) => {
    try {
      const id = req.params.id;
      const { titulo, descricao } = req.body;

      const linhas = await repo.atualizarProva(id, titulo, descricao);

      if (linhas === 0)
        return resp.status(404).send({ erro: 'Prova não encontrada' });

      resp.send();
    } catch (err) {
      console.error(err);
      resp.status(500).send({ erro: 'Erro ao atualizar prova' });
    }
  }
);

// Excluir prova
endpoints.delete(
  '/provas/:id',
  getAuthentication(user => user.tipo === "professor"),
  async (req, resp) => {
    try {
      const id = req.params.id;
      const linhas = await repo.deletarProva(id);

      if (linhas === 0)
        return resp.status(404).send({ erro: 'Prova não encontrada' });

      resp.send();
    } catch (err) {
      console.error(err);
      resp.status(500).send({ erro: 'Erro ao excluir prova' });
    }
  }
);

//
// ===================== PERGUNTAS =====================
//

// Criar pergunta
endpoints.post(
  '/provas/:id/perguntas',
  getAuthentication(user => user.tipo === "professor"),
  async (req, resp) => {
    try {
      const provaId = req.params.id;
      const { texto } = req.body;

      const id = await repo.inserirPergunta(provaId, texto);
      resp.send({ novoId: id });

    } catch (err) {
      console.error(err);
      resp.status(500).send({ erro: 'Erro ao criar pergunta' });
    }
  }
);

// Atualizar pergunta
endpoints.put(
  '/perguntas/:id',
  getAuthentication(user => user.tipo === "professor"),
  async (req, resp) => {
    try {
      const id = req.params.id;
      const { texto } = req.body;

      const linhas = await repo.atualizarPergunta(id, texto);

      if (linhas === 0)
        return resp.status(404).send({ erro: 'Pergunta não encontrada' });

      resp.send();

    } catch (err) {
      console.error(err);
      resp.status(500).send({ erro: 'Erro ao atualizar pergunta' });
    }
  }
);

// Excluir pergunta
endpoints.delete(
  '/perguntas/:id',
  getAuthentication(user => user.tipo === "professor"),
  async (req, resp) => {
    try {
      const id = req.params.id;

      const linhas = await repo.deletarPergunta(id);

      if (linhas === 0)
        return resp.status(404).send({ erro: 'Pergunta não encontrada' });

      resp.send();

    } catch (err) {
      console.error(err);
      resp.status(500).send({ erro: 'Erro ao excluir pergunta' });
    }
  }
);

//
// ===================== OPÇÕES =====================
//

// Criar opção
endpoints.post(
  '/perguntas/:id/opcoes',
  getAuthentication(user => user.tipo === "professor"),
  async (req, resp) => {
    try {
      const perguntaId = req.params.id;
      const { texto, correta } = req.body;

      const id = await repo.inserirOpcao(perguntaId, texto, !!correta);
      resp.send({ novoId: id });

    } catch (err) {
      console.error(err);
      resp.status(500).send({ erro: 'Erro ao criar opção' });
    }
  }
);

// Atualizar opção
endpoints.put(
  '/opcoes/:id',
  getAuthentication(user => user.tipo === "professor"),
  async (req, resp) => {
    try {
      const id = req.params.id;
      const { texto, correta } = req.body;

      const linhas = await repo.atualizarOpcao(id, texto, !!correta);

      if (linhas === 0)
        return resp.status(404).send({ erro: 'Opção não encontrada' });

      resp.send();

    } catch (err) {
      console.error(err);
      resp.status(500).send({ erro: 'Erro ao atualizar opção' });
    }
  }
);

// Excluir opção
endpoints.delete(
  '/opcoes/:id',
  getAuthentication(user => user.tipo === "professor"),
  async (req, resp) => {
    try {
      const id = req.params.id;

      const linhas = await repo.deletarOpcao(id);

      if (linhas === 0)
        return resp.status(404).send({ erro: 'Opção não encontrada' });

      resp.send();

    } catch (err) {
      console.error(err);
      resp.status(500).send({ erro: 'Erro ao excluir opção' });
    }
  }
);

export default endpoints;
