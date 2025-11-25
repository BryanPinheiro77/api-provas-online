import { useEffect, useState } from "react";
import api from "../api/api";
import { useParams } from "react-router-dom";

export default function HistoricoAluno() {
  const { id } = useParams(); // id do aluno
  const [lista, setLista] = useState([]);

  useEffect(() => {
    async function carregar() {
      const resp = await api.get(`/alunos/${id}/submissoes`);
      setLista(resp.data);
    }
    carregar();
  }, [id]);

  return (
    <div className="historico-container">
      <h1 className="titulo">Meu Histórico</h1>

      {lista.map(item => (
        <div key={item.id} className="card-historico">
          <h2>{item.tituloProva}</h2>

          <p><strong>Nota:</strong> {item.nota}</p>

          <p>
            <strong>Acertos:</strong> {item.total_acertos}/{item.total_questoes}
          </p>

          <small className="data">
            {new Date(item.data_submissao).toLocaleString("pt-BR")}
          </small>
        </div>
      ))}
    </div>
  );
}
