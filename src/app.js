const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(req, res, next) {
  const { id } = req.params;
  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid repository ID.' });
  }
  else{
    return next();
  }
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const indexRepository = repositories.findIndex(repository => repository.id == id);
  const { likes } = repositories[indexRepository];
  const repository = { id, title, url, techs, likes };

  repositories[indexRepository] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const indexRepository = repositories.findIndex(repository => repository.id == id);

  repositories.splice(indexRepository, 1);

  return response.status(204).json({});
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id == id);

  repositories[index].likes++;

  return response.json(repositories[index]);
});

module.exports = app;
