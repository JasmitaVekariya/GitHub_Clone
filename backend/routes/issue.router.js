const express = require("express");
const issueController = require("../controllers/issueController.js");

const issueRouter = express.Router();
issueRouter.use(express.json());

issueRouter.post("/issue/create", issueController.createIssue);
issueRouter.get("/issue/all/:repoID", issueController.getAllIssues); // Fix here
issueRouter.get("/issue/:id", issueController.getIssueByID);
issueRouter.put("/issue/update/:id", issueController.updateIssueByID);
issueRouter.delete("/issue/delete/:id", issueController.deleteIssueByID);

module.exports = issueRouter;