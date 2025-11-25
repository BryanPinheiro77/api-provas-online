import { connection } from '../repository/connection.js';

//
// =============== PROVAS ===============
//

export async function criarProva(professorId, titulo, descricao) {
  const [result] = await connection.query(
    `INSERT INTO provas (professor_id, titulo, descricao)
     VALUES (?, ?, ?)`,
    [professorId, titulo, descricao]
  );
  return result.insertId;
}

export async function listarProvas() {
  const [rows] = await connection.query(
    `SELECT p.id,
            p.titulo,
            p.descricao,
            p.data_criacao,
            prof.nome AS nomeProfessor
       FROM provas p
       JOIN professores prof ON prof.id = p.professor_id
      ORDER BY p.id DESC`
  );
  return rows;
}

export async function listarProvasAluno() {
  const [rows] = await connection.query(
    `SELECT id, titulo, descricao
       FROM provas
   ORDER BY data_criacao DESC`
  );
  return rows;
}


export async function buscarProvaPorId(id) {
  const [rows] = await connection.query(
    `SELECT id, professor_id, titulo, descricao, data_criacao
       FROM provas
      WHERE id = ?`,
    [id]
  );
  return rows[0];
}

export async function atualizarProva(id, titulo, descricao) {
  const [result] = await connection.query(
    `UPDATE provas
        SET titulo = ?,
            descricao = ?
      WHERE id = ?`,
    [titulo, descricao, id]
  );
  return result.affectedRows;
}

export async function deletarProva(id) {
  const [result] = await connection.query(
    `DELETE FROM provas WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
}

//
// =============== PERGUNTAS ===============
//

export async function inserirPergunta(provaId, texto) {
  const [result] = await connection.query(
    `INSERT INTO perguntas (prova_id, texto)
     VALUES (?, ?)`,
    [provaId, texto]
  );
  return result.insertId;
}

export async function atualizarPergunta(id, texto) {
  const [result] = await connection.query(
    `UPDATE perguntas
        SET texto = ?
      WHERE id = ?`,
    [texto, id]
  );
  return result.affectedRows;
}

export async function deletarPergunta(id) {
  const [result] = await connection.query(
    `DELETE FROM perguntas WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
}

//
// =============== OPÇÕES ===============
//

export async function inserirOpcao(perguntaId, texto, correta) {
  const [result] = await connection.query(
    `INSERT INTO opcoes (pergunta_id, texto, correta)
     VALUES (?, ?, ?)`,
    [perguntaId, texto, correta]
  );
  return result.insertId;
}

export async function atualizarOpcao(id, texto, correta) {
  const [result] = await connection.query(
    `UPDATE opcoes
        SET texto   = ?,
            correta = ?
      WHERE id = ?`,
    [texto, correta, id]
  );
  return result.affectedRows;
}

export async function deletarOpcao(id) {
  const [result] = await connection.query(
    `DELETE FROM opcoes WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
}

//
// =============== PERGUNTAS + OPÇÕES PARA UMA PROVA ===============
//
// Essa função é usada na tela de EDIÇÃO da prova.
//

export async function listarPerguntasComOpcoes(idProva) {
  const [rows] = await connection.query(
    `SELECT
        per.id     AS perguntaId,
        per.texto  AS perguntaTexto,
        op.id      AS opcaoId,
        op.texto   AS opcaoTexto,
        op.correta AS opcaoCorreta
       FROM perguntas per
  LEFT JOIN opcoes op
         ON op.pergunta_id = per.id
      WHERE per.prova_id = ?
   ORDER BY per.id, op.id`,
    [idProva]
  );

  return rows;
}
