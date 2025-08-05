const express = require("express");
const userController = require("../controllers/userController.js"); 

const userRouter = express.Router();

userRouter.use(express.json());

userRouter.get("/allUser", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/updateuser/:id", userController.updateUserProfile);
userRouter.delete("/deleteuser/:id", userController.deleteUserProfile);

module.exports = userRouter; 