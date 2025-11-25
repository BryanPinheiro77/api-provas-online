import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

// PROFESSOR
import ProfessorHome from "./pages/ProfessorHome";
import CriarProva from "./pages/CriarProva";
import ProvaEdit from "./pages/ProvaEdit.jsx";

// ALUNO
import ProvasDisponiveis from "./pages/ProvasDisponiveis";
import ResponderProva from "./pages/ResponderProva";
import HistoricoAluno from "./pages/HistoricoAluno";

// componente de proteção
import ProtectedRoute from "./components/ProtectedRoute";

// IMPORTAÇÃO DE TODOS OS CSS
import "./styles/global.css";
import "./styles/login.css";
import "./styles/professorHome.css";
import "./styles/criarProva.css";
import "./styles/provasDisponiveis.css";
import "./styles/responderProva.css";
import "./styles/historicoAluno.css";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />

        <Route
          path="/professor/home"
          element={
            <ProtectedRoute component={ProfessorHome} tipo="professor" />
          }
        />

        <Route
          path="/professor/criar-prova"
          element={
            <ProtectedRoute component={CriarProva} tipo="professor" />
          }
        />

        <Route
          path="/aluno/provas"
          element={
            <ProtectedRoute component={ProvasDisponiveis} tipo="aluno" />
          }
        />

        <Route
          path="/aluno/prova/:id"
          element={
            <ProtectedRoute component={ResponderProva} tipo="aluno" />
          }
        />

        <Route
          path="/aluno/historico/:id"
          element={
            <ProtectedRoute component={HistoricoAluno} tipo="aluno" />
          }
        />

        <Route
          path="/professor/prova/:id"
          element={<ProtectedRoute component={ProvaEdit} tipo="professor" />}
        />

      </Routes>
    </BrowserRouter>
  );
}
