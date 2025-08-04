const express = require("express");
const mainRouter = express.Router();

const userRouter = require("./user.router.js"); 

mainRouter.use("/", userRouter); 

mainRouter.get("/", (req, res) => {
  res.send("Welcome to the GitHub Clone API");
});

module.exports = mainRouter;