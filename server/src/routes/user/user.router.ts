import express from "express";
const {
  httpCreateNewUser,
  httpSignIn,
  httpSignOut,
  httpSendVerificationCode,
  httpVerifyVerificationCode,
  httpChangePassword,
} = require("./user.controller");
const { identifier } = require("../../middleware/identification");

const userRouter = express.Router();
userRouter.post("/signup", httpCreateNewUser);
userRouter.post("/signin", httpSignIn);
userRouter.post("/signout", identifier, httpSignOut);
userRouter.patch("/verify", identifier, httpSendVerificationCode);
userRouter.patch("/verify/code", identifier, httpVerifyVerificationCode);
userRouter.patch("/changepassword", identifier, httpChangePassword);

module.exports = userRouter;
