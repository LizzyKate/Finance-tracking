import express from "express";
const {
  httpCreateNewUser,
  httpSignIn,
  httpSignOut,
  httpSendVerificationCode,
  httpVerifyVerificationCode,
  httpChangePassword,
  httpSendForgotPasswordCode,
  httpVerifyForgotPasswordCode,
} = require("./user.controller");
const { identifier } = require("../../middleware/identification");

const userRouter = express.Router();
userRouter.post("/signup", httpCreateNewUser);
userRouter.post("/signin", httpSignIn);
userRouter.post("/signout", identifier, httpSignOut);
userRouter.patch("/verify", identifier, httpSendVerificationCode);
userRouter.patch("/verify/code", identifier, httpVerifyVerificationCode);
userRouter.patch("/change-password", identifier, httpChangePassword);
userRouter.post("/send-reset-code", httpSendForgotPasswordCode);
userRouter.patch("/reset-password", httpVerifyForgotPasswordCode);

module.exports = userRouter;
