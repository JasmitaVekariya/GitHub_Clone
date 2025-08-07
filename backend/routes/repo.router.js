const express = require("express");
const repoController = require("../controllers/repoController.js");

const repoRouter = express.Router();
repoRouter.use(express.json());

repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepository);
repoRouter.get("/repo/:id", repoController.fetchRepositoryByID);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userID", repoController.fetchRepositoriesForCurrentUser);
repoRouter.put("/repo/update/:id", repoController.updateRepositoryByID);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryByID);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityByID);

module.exports = repoRouter;