import { useEffect, useState } from "react";
import api from "../api/api";
import { useParams } from "react-router-dom";
import "../styles/responderProva.css";

export default function ResponderProva() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const [prova, setProva] = useState(null);
  const [respostas, setRespostas] = useState({});
  const [notaModal, setNotaModal] = useState(null); // ⭐ NOVO

  useEffect(() => {
    async function carregar() {
      const resp = await api.get(`/provas/${id}`);
      setProva(resp.data);
    }
    carregar();
  }, [id]);

  function selecionar(perguntaId, opcaoId) {
    setRespostas({
      ...respostas,
      [perguntaId]: opcaoId
    });
  }

  async function enviar() {
    const lista = Object.entries(respostas).map(([perguntaId, opcaoId]) => ({
      perguntaId: Number(perguntaId),
      opcaoId: Number(opcaoId)
    }));

    const resp = await api.post(`/provas/${id}/responder`, {
      alunoId: user.id,
      respostas: lista
    });

    // ⭐ Abre modal com a nota
    setNotaModal(resp.data.nota);
  }

  function fecharModal() {
    window.location.href = "/aluno/provas";
  }

  if (!prova) return <h1>Carregando...</h1>;

  return (
    <div className="container responder-page">

      <h1>{prova.titulo}</h1>
      <p>{prova.descricao}</p>

      {prova.perguntas.map(p => (
        <div key={p.id} className="card">
          <h3>{p.texto}</h3>

          {p.opcoes.map(op => (
            <label key={op.id} className="opcao">
              <input
                type="radio"
                name={`pergunta-${p.id}`}
                onChange={() => selecionar(p.id, op.id)}
              />
              {op.texto}
            </label>
          ))}
        </div>
      ))}

      <button className="btn-enviar" onClick={enviar}>
        Enviar respostas
      </button>

      {/* ⭐ MODAL DA NOTA */}
      {notaModal !== null && (
        <div className="modal-fundo">
          <div className="modal-card">
            <h2>Sua nota foi:</h2>
            <p className="nota">{notaModal}</p>
            <button className="btn-ok" onClick={fecharModal}>OK</button>
          </div>
        </div>
      )}

    </div>
  );
}
