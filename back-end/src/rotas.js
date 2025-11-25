import express from 'express';
import professorController from './controller/professorController.js';
import alunoController from './controller/alunoController.js';
import provaController from './controller/provaController.js';
import submissaoController from './controller/submissaoController.js';
import loginController from "./controller/loginController.js";

export function adicionarRotas(api) {
  api.use(professorController);
  api.use(loginController);
  api.use(alunoController);
  api.use(provaController);
  api.use(submissaoController);
}
