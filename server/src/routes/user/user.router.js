const express = require("express");
const { httpCreateNewUser, httpSignIn } = require("./user.controller");

const userRouter = express.Router();
userRouter.post("/signup", httpCreateNewUser);
userRouter.post("/signin", httpSignIn);

module.exports = userRouter;
