CREATE DATABASE provas_online;
USE provas_online;

CREATE TABLE professores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(100) NOT NULL
);

CREATE TABLE alunos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(100) NOT NULL
);

CREATE TABLE provas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  professor_id INT NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  data_criacao DATETIME DEFAULT NOW(),
  FOREIGN KEY (professor_id)
    REFERENCES professores(id)
    ON DELETE CASCADE
);

CREATE TABLE perguntas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  prova_id INT NOT NULL,
  texto TEXT NOT NULL,
  FOREIGN KEY (prova_id)
    REFERENCES provas(id)
    ON DELETE CASCADE
);

CREATE TABLE opcoes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pergunta_id INT NOT NULL,
  texto TEXT NOT NULL,
  correta BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (pergunta_id)
    REFERENCES perguntas(id)
    ON DELETE CASCADE
);

CREATE TABLE submissoes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  prova_id INT NOT NULL,
  aluno_id INT NOT NULL,
  data_submissao DATETIME DEFAULT NOW(),
  nota DECIMAL(5,2),
  total_questoes INT,
  total_acertos INT,
  FOREIGN KEY (prova_id)
    REFERENCES provas(id)
    ON DELETE CASCADE,
  FOREIGN KEY (aluno_id)
    REFERENCES alunos(id)
    ON DELETE CASCADE
);

CREATE TABLE respostas_submissao (
  id INT PRIMARY KEY AUTO_INCREMENT,
  submissao_id INT NOT NULL,
  pergunta_id INT NOT NULL,
  opcao_id INT NOT NULL,
  correta BOOLEAN,
  FOREIGN KEY (submissao_id)
    REFERENCES submissoes(id)
    ON DELETE CASCADE,
  FOREIGN KEY (pergunta_id)
    REFERENCES perguntas(id)
    ON DELETE CASCADE,
  FOREIGN KEY (opcao_id)
    REFERENCES opcoes(id)
    ON DELETE CASCADE
);

-- Inserir professor padrão
INSERT INTO professores (nome, email, senha)
VALUES ('Professor Teste', 'prof@teste.com', MD5('123'));

-- Inserir aluno padrão
INSERT INTO alunos (nome, email, senha)
VALUES ('Aluno Teste', 'aluno@teste.com', MD5('123'));
