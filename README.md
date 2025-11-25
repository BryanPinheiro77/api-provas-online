# Provas Online 📘✨

![Badge](https://img.shields.io/badge/Node.js-Backend-green)
![Badge](https://img.shields.io/badge/MySQL-Database-blue)
![Badge](https://img.shields.io/badge/React-Frontend-61DAFB)
![Badge](https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange)

---

## 📌 Sobre o Projeto

O **Provas Online** é um sistema completo para criação, execução e correção automática de provas.

Criado como projeto pessoal para treinar:

- Desenvolvimento de APIs REST com **Node.js**
- Comunicação front-end (React) + back-end
- Organização de tabelas e relacionamentos em **MySQL**
- Fluxo completo de submissão e cálculo de notas

---

## ✨ Funcionalidades

### 📝 Provas  
- Criar provas  
- Listar provas disponíveis  
- Buscar prova por ID  

### ❓ Perguntas e Opções  
- Criar perguntas vinculadas às provas  
- Criar opções  
- Definir opção correta  

### 🧠 Submissões  
- Enviar respostas do aluno  
- Salvar respostas no banco  
- Calcular automaticamente:  
  - Total de questões  
  - Total de acertos  
  - Nota final  
- Retorno imediato com a nota  

### 💻 Front-end em React  
- Listagem das provas  
- Página para responder  
- Exibição da nota final  
- Comunicação com a API via Axios  

---

## 🗄️ Banco de Dados

Antes de iniciar o back-end, é necessário criar o banco de dados.

Use o script SQL localizado em:

```
back-end/sql/ddl.sql
```

Execute o arquivo no MySQL Workbench (ou qualquer cliente SQL) para criar o schema e as tabelas necessárias.

---

## ▶️ Como Executar o Projeto

---

## 📌 Back-end (server)

Instale as dependências:

```
cd back-end
npm install
```

Crie o arquivo `.env`:

```
PORT=5010
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PWD=SUA_SENHA_AQUI
MYSQL_DB=provas_online
```

Execute o servidor:

```
npm run dev
```

---

## 📌 Front-end (client)

Instale as dependências:

```
cd front-end
npm install
npm run dev
```

Acesse no navegador:

```
http://localhost:5173
```


---

## 👨‍💻 Autor

**Bryan Mendes Pinheiro**

🔗 GitHub  
🔗 LinkedIn  
