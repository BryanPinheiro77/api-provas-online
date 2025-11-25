import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import "../styles/provaEdit.css";

export default function ProvaEdit() {
  const { id } = useParams();

  const [prova, setProva] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const resp = await api.get(`/provas/${id}`);
        setProva(resp.data); // mantém a estrutura original
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar prova.");
      }
      setCarregando(false);
    }
    carregar();
  }, [id]);

  if (carregando) return <p>Carregando...</p>;
  if (!prova) return <p>Prova não encontrada.</p>;

  // ==========================
  // Editar pergunta
  // ==========================
  function editarPergunta(index, texto) {
    const clone = { ...prova };
    clone.perguntas[index].texto = texto;
    setProva(clone);
  }

  // ==========================
  // Editar opção
  // ==========================
  function editarOpcao(pIndex, oIndex, texto) {
    const clone = { ...prova };
    clone.perguntas[pIndex].opcoes[oIndex].texto = texto;
    setProva(clone);
  }

  // ==========================
  // Alternar opção correta
  // ==========================
  function marcarCorreta(pIndex, oIndex) {
    const clone = { ...prova };

    clone.perguntas[pIndex].opcoes.forEach((o, i) => {
      o.correta = i === oIndex ? 1 : 0;
    });

    setProva(clone);
  }

  // ==========================
  // Salvar alterações
  // ==========================
  async function salvarAlteracoes() {
    await api.put(`/provas/${id}`, {
      titulo: prova.titulo,
      descricao: prova.descricao
    });

    for (let p of prova.perguntas) {
      await api.put(`/perguntas/${p.id}`, { texto: p.texto });

      for (let op of p.opcoes) {
        await api.put(`/opcoes/${op.id}`, {
          texto: op.texto,
          correta: op.correta
        });
      }
    }

    alert("Alterações salvas!");
    window.location.href = "/professor/home";

  }

  return (
    <div className="prova-edit-container">
      <div className="prova-edit-card">

        <h1>Editar Prova</h1>

        <input
          value={prova.titulo}
          onChange={(e) => setProva({ ...prova, titulo: e.target.value })}
        />

        <textarea
          value={prova.descricao}
          onChange={(e) => setProva({ ...prova, descricao: e.target.value })}
        />

        <hr />

        <h3>Perguntas da Prova</h3>

        {prova.perguntas.map((p, pIndex) => (
          <div key={p.id} className="pergunta-card">

            <input
              className="pergunta-input"
              value={p.texto}
              onChange={(e) => editarPergunta(pIndex, e.target.value)}
            />

            {p.opcoes.map((o, oIndex) => (
  <div className={`opcao ${o.correta === 1 ? "correta" : ""}`} key={o.id}>
    
    <input
      type="text"
      className="opcao-texto"
      value={o.texto}
      onChange={(e) =>
        editarOpcao(pIndex, oIndex, e.target.value)
      }
    />

    <input
      type="radio"
      name={`p-${pIndex}`}
      checked={Number(o.correta) === 1}
      onChange={() => marcarCorreta(pIndex, oIndex)}
    />

  </div>
))}

          </div>
        ))}

        <button className="btn-salvar" onClick={salvarAlteracoes}>
          Salvar Alterações
        </button>

      </div>
    </div>
  );
}
