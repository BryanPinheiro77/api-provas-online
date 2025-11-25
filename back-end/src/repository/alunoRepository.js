import { connection } from '../repository/connection.js';

export async function inserirAluno(nome, email, senha) {
  const [result] = await connection.query(
    `INSERT INTO alunos (nome, email, senha)
       VALUES (?, ?, MD5(?))`,
    [nome, email, senha]
  );
  return result.insertId;
}

export async function listarAlunos() {
  const [rows] = await connection.query(
    `SELECT id, nome, email FROM alunos`
  );
  return rows;
}

export async function buscarAlunoPorId(id) {
  const [rows] = await connection.query(
    `SELECT id, nome, email FROM alunos WHERE id = ?`,
    [id]
  );
  return rows[0];
}

export async function loginAluno(email, senha) {
  const [rows] = await connection.query(
    `SELECT id, nome, email
       FROM alunos
      WHERE email = ?
        AND senha = MD5(?)`,
    [email, senha]
  );
  return rows[0];
}

export async function atualizarAluno(id, nome, email, senha) {
  const [result] = await connection.query(
    `UPDATE alunos
        SET nome = ?,
            email = ?,
            senha = MD5(?)
      WHERE id = ?`,
    [nome, email, senha, id]
  );
  return result.affectedRows;
}

export async function deletarAluno(id) {
  const [result] = await connection.query(
    `DELETE FROM alunos WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
}
