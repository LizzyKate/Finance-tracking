import express from "express";
const {
  httpCreateNewUser,
  httpSignIn,
  httpSignOut,
  httpVerifyUser,
} = require("./user.controller");

const userRouter = express.Router();
userRouter.post("/signup", httpCreateNewUser);
userRouter.post("/signin", httpSignIn);
userRouter.post("/signout", httpSignOut);
userRouter.post("/verify", httpVerifyUser);

module.exports = userRouter;
