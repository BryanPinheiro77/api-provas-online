import * as repo from '../repository/alunoRepository.js';
import { Router } from 'express';

const endpoints = Router();

// Criar aluno
endpoints.post('/alunos', async (req, resp) => {
  try {
    const { nome, email, senha } = req.body;
    const id = await repo.inserirAluno(nome, email, senha);
    resp.send({ novoId: id });
  } catch (err) {
    console.log(err);
    resp.status(500).send({ erro: 'Erro ao cadastrar aluno' });
  }
});

// Listar todos
endpoints.get('/alunos', async (req, resp) => {
  try {
    const lista = await repo.listarAlunos();
    resp.send(lista);
  } catch (err) {
    resp.status(500).send({ erro: 'Erro ao listar alunos' });
  }
});

// Buscar por ID
endpoints.get('/alunos/:id', async (req, resp) => {
  try {
    const id = req.params.id;
    const aluno = await repo.buscarAlunoPorId(id);

    if (!aluno)
      resp.status(404).send({ erro: 'Aluno não encontrado' });
    else
      resp.send(aluno);
  } catch (err) {
    resp.status(500).send({ erro: 'Erro ao buscar aluno' });
  }
});

// Editar aluno
endpoints.put('/alunos/:id', async (req, resp) => {
  try {
    const id = req.params.id;
    const { nome, email, senha } = req.body;
    const linhas = await repo.atualizarAluno(id, nome, email, senha);

    if (linhas === 0)
      resp.status(404).send({ erro: 'Aluno não encontrado' });
    else
      resp.send();
  } catch (err) {
    resp.status(500).send({ erro: 'Erro ao atualizar aluno' });
  }
});

// Excluir aluno
endpoints.delete('/alunos/:id', async (req, resp) => {
  try {
    const id = req.params.id;
    const linhas = await repo.deletarAluno(id);

    if (linhas === 0)
      resp.status(404).send({ erro: 'Aluno não encontrado' });
    else
      resp.send();
  } catch (err) {
    resp.status(500).send({ erro: 'Erro ao excluir aluno' });
  }
});

export default endpoints;
