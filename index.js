const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

let contador = 0;

//midlewere executa antes de tudo
function checkUserExists(req, res, next) {
  const { id } = req.params;
  const projectPut = projects.find(p => p.id === id);

  if (!projectPut) {
    return res.status(400).json({ error: "Projeto nao existe" });
  }

  return next();
}

function countRequest(req, res, next) {
  contador++;

  console.log(`quantidade de requisicoes = ${contador}`);

  return next();
}

//A rota deve receber id e title dentro corpo de cadastrar um novo projeto dentro de um array no seguinte formato
server.post("/projects", countRequest, (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

//Rota que lista todos projetos e suas tarefas;
server.get("/projects", countRequest, (req, res) => {
  return res.json(projects);
});

// A rota deve alterar apenas o título do projeto com o id presente nos parâmetros da rota;
server.put("/projects/:id", checkUserExists, countRequest, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projectPut = projects.find(p => p.id === id);

  projectPut.title = title;

  return res.json(projects);
});

//A rota deve deletar o projeto com o id presente nos parâmetros da rota;
server.delete("/projects/:id", checkUserExists, countRequest, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id === id);

  projects.splice(projectIndex, 1);

  return res.json(projects);
});

// A rota deve receber um campo title e armazenar uma nova tarefa no array de tarefas de um projeto específico escolhido através do id presente nos parâmetros da rota;
server.post(
  "/projects/:id/tasks",
  checkUserExists,
  countRequest,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const projectTask = projects.find(p => p.id === id);

    projectTask.tasks.push(title);

    return res.json(projects);
  }
);

server.post(
  "/projects/:id/:title",
  checkUserExists,
  countRequest,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.params;

    const projectTask = projects.find(p => p.id === id);

    projectTask.tasks.push(title);

    return res.json(projects);
  }
);

server.listen(3000);
