import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ component: Component, tipo }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Sem user OU sem token → volta para login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // Verifica tipo permitido (professor ou aluno)
  if (tipo && user.tipo !== tipo) {
    return <Navigate to="/login" replace />;
  }

  return <Component />;
}
