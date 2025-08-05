const express = require("express");
const repoController = require("../controllers/repoController.js");
const repoRouter = express.Router();
repoRouter.use(express.json());
const mongoose = require("mongoose");
const Repository = require("../models/repoModel.js");
const User = require("../models/userModel.js");
const Issue = require("../models/issuesModel.js");

async function craeteRepository(req,res)
{
    try{
        const {owner,name,issue,content,description,visibility} = new Repository(req.body);
        const user = await User.findById(owner);
        if(!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(404).send("User not found");
        }
        if(!name || !issue || !content || !description || !visibility) {
            return res.status(400).send("All fields are required");
        }
        const repository = new Repository({
            owner: user._id,
            name,
            issue,
            content,
            description,
            visibility
        });
        const result = await repository.save();
        res.status(201).json({
            message: "Repository created successfully",
            repositoryID: result._id
        });

        user.repositories.push(result._id);   
    }
    catch(error)
    {
        console.error("Error creating repository:", error);
        res.status(500).send("Internal Server Error");
    }
}
async function getAllRepository(req,res)
{
    try{
        const repositories = await Repository.find({}).populate("owner").populate("issues");
        res.status(200).json(repositories);

    }
    catch(error)
    {
        console.error("Error fetching all repositories:", error);
        res.status(500).send("Internal Server Error");
    }
}
async function fetchRepositoryByID(req,res)
{
   const {repoID }= req.params.id;
    if (!mongoose.Types.ObjectId.isValid(repoID)) {
        return res.status(400).send("Invalid repository ID format");
    }
    try{
        const repository = await Repository.find(
            {_id: repoID}
        ).populate("owner").populate("issues").toArray;
        if (!repository) {
            return res.status(404).send("Repository not found");
        }
        res.status(200).json(repository);
    }
    catch(error)
    {
        console.error("Error fetching repository by ID:", error);
        res.status(500).send("Internal Server Error");
    }
}
async function fetchRepositoryByName(req,res)
{
   const {repoName }= req.params.name;
    if (!mongoose.Types.ObjectId.isValid(repoID)) {
        return res.status(400).send("Invalid repository ID format");
    }
    try{
        const repository = await Repository.find(
            {name: repoName}
        ).populate("owner").populate("issues").toArry;
        if (!repository) {
            return res.status(404).send("Repository not found");
        }
        res.status(200).json(repository);
    }
    catch(error)
    {
        console.error("Error fetching repository by ID:", error);
        res.status(500).send("Internal Server Error");
    }
}
async function fetchRepositoriesForCurrentUser(req,res)
{
   const userID = req.user;
    if (!mongoose.Types.ObjectId.isValid(userID)) {
        return res.status(400).send("Invalid user ID format");
    }
    try{
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const repositories = await Repository.find({owner: user._id}).populate("owner").populate("issues");
        res.status(200).json(repositories);
    }
    catch(error)
    {
        console.error("Error fetching repositories for user:", error);
        res.status(500).send("Internal Server Error");
    }
}

async function updateRepositoryByID(req,res)
{
    const {id} = req.params;
    const { content, description} = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid repository ID format");
    }
    try{
        const repository = await Repository.findById(id).populate("owner").populate("issues");

        if (!repository) {
            return res.status(404).send("Repository not found");
        }
        if (content) {
            repository.content.push(content);
        }
        if (description) {
            repository.description = description;
        }
        const updatedRepository = await repository.save();
        res.status(200).json({
            message: "Repository updated successfully",
            repository:updatedRepository 
        });
    }
    catch(error)
    {
        console.error("Error updating repository:", error);
        res.status(500).send("Internal Server Error");
    }   
}

async function deleteRepositoryByID(req,res)
{
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid repository ID format");
    }
    try{
        const repository = await Repository.findByIdAndDelete(id);
        if (!repository) {
            return res.status(404).send("Repository not found");
        }
        res.status(200).json({
            message: "Repository deleted successfully",
            repositoryID: id});
}
    catch(error)
    {
        console.error("Error deleting repository:", error);
        res.status(500).send("Internal Server Error");
    }
}

async function toggleVisibilityByID(req,res)
{
   const {id} = req.params;
   

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid repository ID format");
    }
    try{
        const repository = await Repository.findById(id).populate("owner").populate("issues");

        if (!repository) {
            return res.status(404).send("Repository not found");
        }
        repository.visibility = !repository.visibility; // Toggle visibility
        const updatedRepository = await repository.save();
        res.status(200).json({
            message: "Repository updated successfully",
            repository:updatedRepository 
        });
    }
    catch(error)
    {
        console.error("Error updating repository:", error);
        res.status(500).send("Internal Server Error");
    }   
}

module.exports = {
    craeteRepository,   
    getAllRepository,
    fetchRepositoryByID,        
    fetchRepositoryByName,
    fetchRepositoriesForCurrentUser,
    updateRepositoryByID,
    deleteRepositoryByID,
    toggleVisibilityByID
};
