import { Router } from "express";
import { connection } from "../repository/connection.js";
import { generateToken } from "../utils/jwt.js";

const endpoints = Router();

endpoints.post("/login", async (req, resp) => {
  const { email, senha } = req.body;

  // 1) Login professor
  const [prof] = await connection.query(
    `SELECT id, nome, email 
       FROM professores 
      WHERE email = ? 
        AND senha = MD5(?)`,
    [email, senha]
  );

  if (prof.length > 0) {
    const user = { id: prof[0].id, nome: prof[0].nome, tipo: "professor" };
    const token = generateToken(user);
    return resp.send({ user, token });
  }

  // 2) Login aluno
  const [aluno] = await connection.query(
    `SELECT id, nome, email 
       FROM alunos 
      WHERE email = ? 
        AND senha = MD5(?)`,
    [email, senha]
  );

  if (aluno.length > 0) {
    const user = { id: aluno[0].id, nome: aluno[0].nome, tipo: "aluno" };
    const token = generateToken(user);
    return resp.send({ user, token });
  }

  return resp.status(404).send({ erro: "Email ou senha incorretos" });
});

export default endpoints;
