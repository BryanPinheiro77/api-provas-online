import express from "express";
import cors from "cors";
import { adicionarRotas } from "./rotas.js";

const app = express();
app.use(cors());
app.use(express.json());

adicionarRotas(app);

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => console.log(`🚀 API rodando em http://localhost:${PORT}`));
