import { useState } from "react";
import api from "../api/api";
import "../styles/criarProva.css";

export default function CriarProva() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [perguntas, setPerguntas] = useState([]);

  function adicionarPergunta() {
    setPerguntas(prev => [
      ...prev,
      { texto: "", opcoes: [{ texto: "", correta: false }] }
    ]);
  }

  function removerPergunta(index) {
    setPerguntas(prev => prev.filter((_, i) => i !== index));
  }

  function adicionarOpcao(pIndex) {
    const copia = [...perguntas];
    copia[pIndex].opcoes.push({ texto: "", correta: false });
    setPerguntas(copia);
  }

  function removerOpcao(pIndex, oIndex) {
    const copia = [...perguntas];
    copia[pIndex].opcoes = copia[pIndex].opcoes.filter((_, i) => i !== oIndex);
    setPerguntas(copia);
  }

  function marcarCorreta(pIndex, oIndex) {
    const copia = [...perguntas];
    copia[pIndex].opcoes = copia[pIndex].opcoes.map((op, i) => ({
      ...op,
      correta: i === oIndex,
    }));
    setPerguntas(copia);
  }

  async function salvar() {
    const resp = await api.post("/provas", {
      professorId: user.id,
      titulo,
      descricao
    });

    const provaId = resp.data.novoId;

    for (let i = 0; i < perguntas.length; i++) {
      const p = perguntas[i];

      const r = await api.post(`/provas/${provaId}/perguntas`, {
        texto: p.texto
      });

      const perguntaId = r.data.novoId;

      for (let op of p.opcoes) {
        await api.post(`/perguntas/${perguntaId}/opcoes`, op);
      }
    }

    alert("Prova criada com sucesso!");
    window.location.href = "/professor/home";
  }

  return (
    <div className="criar-prova-container">

      <h1>Criar Prova</h1>

      <div className="criar-prova-card">

        <input
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          placeholder="Título da prova"
        />

        <textarea
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          placeholder="Descrição"
        />

        {/* Botão que agora fica SEMPRE abaixo da última pergunta */}
        <button className="btn-add-pergunta" onClick={adicionarPergunta}>
          + Adicionar pergunta
        </button>

        {perguntas.map((p, pIndex) => (
          <div key={pIndex} className="bloco-pergunta">
            
            <div className="header-pergunta">
              <h3>Pergunta {pIndex + 1}</h3>
              <button className="btn-remover" onClick={() => removerPergunta(pIndex)}>
                Excluir
              </button>
            </div>

            <input
              value={p.texto}
              onChange={e => {
                const copia = [...perguntas];
                copia[pIndex].texto = e.target.value;
                setPerguntas(copia);
              }}
              placeholder="Texto da pergunta"
            />

            <button className="btn-add-opcao" onClick={() => adicionarOpcao(pIndex)}>
              + Opção
            </button>

            {p.opcoes.map((op, oIndex) => (
              <div key={oIndex} className="opcao">

                <input
                  value={op.texto}
                  onChange={e => {
                    const copia = [...perguntas];
                    copia[pIndex].opcoes[oIndex].texto = e.target.value;
                    setPerguntas(copia);
                  }}
                  placeholder={`Opção ${oIndex + 1}`}
                />

                <input
                  type="radio"
                  name={`pergunta-${pIndex}`}
                  checked={op.correta}
                  onChange={() => marcarCorreta(pIndex, oIndex)}
                />

                <button
                  className="btn-opcao-delete"
                  onClick={() => removerOpcao(pIndex, oIndex)}
                >
                  🗑
                </button>
              </div>
            ))}

            {/* Botão desce automáticamente pois está aqui dentro */}
            <button className="btn-add-pergunta" onClick={adicionarPergunta}>
              + Adicionar pergunta
            </button>

          </div>
        ))}

        <button className="btn-salvar" onClick={salvar}>
          Salvar Prova
        </button>

      </div>
    </div>
  );
}
