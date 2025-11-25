import * as repo from '../repository/professorRepository.js';
import { Router } from 'express';

const endpoints = Router();

// Criar professor
endpoints.post('/professores', async (req, resp) => {
  try {
    const { nome, email, senha } = req.body;
    const id = await repo.inserirProfessor(nome, email, senha);
    resp.send({ novoId: id });
  } catch (err) {
    console.log(err);
    resp.status(500).send({ erro: 'Erro ao cadastrar professor' });
  }
});

// Listar todos
endpoints.get('/professores', async (req, resp) => {
  try {
    const lista = await repo.listarProfessores();
    resp.send(lista);
  } catch (err) {
    resp.status(500).send({ erro: 'Erro ao listar professores' });
  }
});

// Buscar por ID
endpoints.get('/professores/:id', async (req, resp) => {
  try {
    const id = req.params.id;
    const professor = await repo.buscarProfessorPorId(id);

    if (!professor)
      resp.status(404).send({ erro: 'Professor não encontrado' });
    else
      resp.send(professor);
  } catch (err) {
    resp.status(500).send({ erro: 'Erro ao buscar professor' });
  }
});

// Editar professor
endpoints.put('/professores/:id', async (req, resp) => {
  try {
    const id = req.params.id;
    const { nome, email, senha } = req.body;
    const linhas = await repo.atualizarProfessor(id, nome, email, senha);

    if (linhas === 0)
      resp.status(404).send({ erro: 'Professor não encontrado' });
    else
      resp.send();
  } catch (err) {
    resp.status(500).send({ erro: 'Erro ao atualizar professor' });
  }
});

// Excluir professor
endpoints.delete('/professores/:id', async (req, resp) => {
  try {
    const id = req.params.id;
    const linhas = await repo.deletarProfessor(id);

    if (linhas === 0)
      resp.status(404).send({ erro: 'Professor não encontrado' });
    else
      resp.send();
  } catch (err) {
    resp.status(500).send({ erro: 'Erro ao excluir professor' });
  }
});

export default endpoints;
