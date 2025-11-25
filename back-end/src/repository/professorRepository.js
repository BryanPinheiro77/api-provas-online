import { connection } from '../repository/connection.js';

export async function inserirProfessor(nome, email, senha) {
  const [result] = await connection.query(
    `INSERT INTO professores (nome, email, senha)
       VALUES (?, ?, MD5(?))`,
    [nome, email, senha]
  );
  return result.insertId;
}

export async function listarProfessores() {
  const [rows] = await connection.query(
    `SELECT id, nome, email FROM professores`
  );
  return rows;
}

export async function buscarProfessorPorId(id) {
  const [rows] = await connection.query(
    `SELECT
    id, 
    nome, 
    email 
    FROM professores WHERE id = ?`,
    [id]
  );
  return rows[0];
}

export async function loginProfessor(email, senha) {
  const [rows] = await connection.query(
    `SELECT id, nome, email
       FROM professores
      WHERE email = ?
        AND senha = MD5(?)`,
    [email, senha]
  );
  return rows[0];
}

export async function atualizarProfessor(id, nome, email, senha) {
  const [result] = await connection.query(
    `UPDATE professores
        SET nome = ?,
            email = ?,
            senha = MD5(?)
      WHERE id = ?`,
    [nome, email, senha, id]
  );
  return result.affectedRows;
}

export async function deletarProfessor(id) {
  const [result] = await connection.query(
    `DELETE FROM professores WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
}
