import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/provasDisponiveis.css";

export default function ProvasDisponiveis() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [provas, setProvas] = useState([]);

  useEffect(() => {
    async function carregar() {
      const resp = await api.get("/provas/disponiveis");
      setProvas(resp.data);
    }
    carregar();
  }, []);

  function responder(idProva) {
    window.location.href = `/aluno/prova/${idProva}`;
  }

  function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "/login";
}



  return (

    
    <div className="provas-container">
      <button onClick={logout} className="btn sair">Sair</button>

  
      <h1 className="titulo-pagina">Provas Disponíveis</h1>

      <div className="lista-provas">
        {provas.length === 0 && (
          <p className="nenhuma-prova">Nenhuma prova disponível no momento.</p>
        )}

        {provas.map((p) => (
          <div key={p.id} className="prova-card">
            <h2>{p.titulo}</h2>
            <p>{p.descricao}</p>

            <button className="btn responder" onClick={() => responder(p.id)}>
              Responder Prova
            </button>
          </div>
        ))}
      </div>

      <button
        className="btn historico"
        onClick={() => window.location.href = `/aluno/historico/${user.id}`}
      >
        Ver meu histórico
      </button>

    </div>
  );
}
