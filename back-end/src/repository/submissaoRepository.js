import { connection } from './connection.js';

// ===================== CRIAR SUBMISSÃO =====================
export async function criarSubmissao(provaId, alunoId, nota, totalQuestoes, totalAcertos) {
  const [result] = await connection.query(
    `INSERT INTO submissoes (prova_id, aluno_id, nota, total_questoes, total_acertos)
     VALUES (?, ?, ?, ?, ?)`,
    [provaId, alunoId, nota, totalQuestoes, totalAcertos]
  );
  return result.insertId;
}

// ===================== INSERIR RESPOSTAS =====================
export async function inserirRespostaSubmissao(submissaoId, perguntaId, opcaoId, correta) {
  const [result] = await connection.query(
    `INSERT INTO respostas_submissao (submissao_id, pergunta_id, opcao_id, correta)
     VALUES (?, ?, ?, ?)`,
    [submissaoId, perguntaId, opcaoId, correta]
  );
  return result.insertId;
}

// ===================== LISTAR SUBMISSÕES DO ALUNO =====================
export async function listarSubmissoesPorAluno(alunoId) {
  const [rows] = await connection.query(
    `SELECT sub.id,
            sub.data_submissao,
            sub.nota,
            sub.total_acertos,
            sub.total_questoes,
            p.titulo AS tituloProva
       FROM submissoes sub
       JOIN provas p ON p.id = sub.prova_id
      WHERE sub.aluno_id = ?
   ORDER BY sub.data_submissao DESC`,
    [alunoId]
  );
  return rows;
}


// ===================== DETALHES DA SUBMISSÃO =====================
export async function buscarSubmissaoPorId(id) {
  const [rows] = await connection.query(
    `SELECT *
       FROM submissoes
      WHERE id = ?`,
    [id]
  );
  return rows[0];
}
