import { useState } from "react";
import api from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function logar() {
    try {
      const resp = await api.post("/login", { email, senha });

      // pega user e token separados
      const { user, token } = resp.data;

      // salva no localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      // redirecionamento por tipo
      if (user.tipo === "professor")
        window.location.href = "/professor/home";
      else
        window.location.href = "/aluno/provas";

    } catch (err) {
      setErro("Email ou senha incorretos");
    }
  }

  return (
    <div className="login-container">
      <h1>Sistema de Provas</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Senha"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      <button onClick={logar}>Entrar</button>

      {erro && <p className="erro">{erro}</p>}
    </div>
  );
}
