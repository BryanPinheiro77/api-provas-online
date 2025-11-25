import { useEffect, useState } from "react"; 
import api from "../api/api";
import "../styles/professorHome.css";

export default function ProfessorHome() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [provas, setProvas] = useState([]);

  useEffect(() => {
    async function carregar() {
      const resp = await api.get(`/provas/professor/${user.id}`);
      setProvas(resp.data);
    }
    carregar();
  }, []);

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "/login";
}


  async function excluirProva(id) {
  if (!confirm("Deseja excluir esta prova?")) return;

  try {
    const resp = await api.delete(`/provas/${id}`);
    console.log("DELETADO:", resp.data);

    setProvas(prev => prev.filter(p => p.id !== id));
  } catch (err) {
    console.error("ERRO AO EXCLUIR:", err);
    alert("Erro ao excluir (veja o console)");
  }
}


  return (
    <div className="page-container prof-home">
      <button onClick={logout} className="btn sair">Sair</button>
      <div className="card">
        <h1>Bem-vindo, {user.nome}</h1>
        <p>Gerencie aqui suas provas criadas.</p>

        <a href="/professor/criar-prova" className="btn">Criar nova prova</a>
      </div>

      <div className="card">
        <h2>Suas Provas</h2>

        <div className="provas-lista">
          {provas.length === 0 && <p>Nenhuma prova criada ainda.</p>}

          {provas.map((p) => (
            <div key={p.id} className="prova-item">
              <h3>{p.titulo}</h3>
              <p>{p.descricao}</p>

              <div className="btn-area">
                <a href={`/professor/prova/${p.id}`} className="btn azul">
                  Editar
                </a>

                <button
                  className="btn vermelho"
                  onClick={() => excluirProva(p.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
