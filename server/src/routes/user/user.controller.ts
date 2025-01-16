const {
  createUser,
  signIn,
  sendVerificationCode,
  verifyVerificationCode,
  changePassword,
  sendForgotPasswordCode,
  verifyForgotPasswordCode,
} = require("../../models/user.model");
import {
  validateAuthFields,
  validateVerificationRequest,
  validateVerificationCode,
  validateChangePassword,
  validateForgotPasswordRequest,
  validateResetPassword,
  validateRequest,
} from "../../middleware/validator";
import { Request, Response } from "express";

interface User {
  email: string;
  password: string;
  token?: string;
}

interface ValidationResult {
  error?: { details: { message: string }[] };
  value?: User;
}

interface VerifyUserRequest extends Request {
  body: {
    email: string;
  };
}
async function httpCreateNewUser(
  req: Request,
  res: Response
): Promise<Response> {
  const { error } = validateRequest(validateAuthFields, req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details.map((detail) => detail.message),
    });
  }

  const { email, password } = req.body;

  try {
    const newUser: User = await createUser({ email, password });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error: any) {
    if (error.message === "User already exists") {
      return res.status(409).send({ error: error.message });
    }
    return res.status(500).send({ error: error.message });
  }
}

async function httpSignIn(
  req: { body: { email: string; password: string } },
  res: Response
): Promise<Response> {
  const { error } = validateRequest(validateAuthFields, req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details.map((detail) => detail.message),
    });
  }

  const { email, password } = req.body;

  try {
    const user = await signIn({ email, password });
    const jwtExpiryInSeconds = parseInt(process.env.JWT_EXPIRY || "3600", 10);

    res.cookie("Authorization", "Bearer " + user.token, {
      httpOnly: process.env.NODE_ENV === "production" ? true : false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: jwtExpiryInSeconds * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "User signed in successfully",
      user,
    });
  } catch (error: any) {
    if (
      error.message === "User does not exist" ||
      error.message === "Password is incorrect"
    ) {
      return res.status(401).send({ success: false, error: error.message });
    }
    return res.status(500).send({ success: false, error: error.message });
  }
}

async function httpSignOut(req: Request, res: Response): Promise<Response> {
  res.clearCookie("Authorization");
  return res.status(200).json({ success: true, message: "User signed out" });
}

async function httpSendVerificationCode(
  req: VerifyUserRequest,
  res: Response
): Promise<Response> {
  const { error } = validateRequest(validateVerificationRequest, req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details.map((detail) => detail.message),
    });
  }
  const { email } = req.body;
  try {
    const user = await sendVerificationCode({ email });
    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
      user,
    });
  } catch (error: any) {
    if (
      error.message === "User does not exist" ||
      error.message === "User is already verified"
    ) {
      return res.status(401).send({ error: error.message });
    }
    return res.status(500).send({ error: error.message });
  }
}

async function httpVerifyVerificationCode(
  req: { body: { email: string; verificationCode: string } },
  res: Response
): Promise<Response> {
  const { error } = validateRequest(validateVerificationCode, req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details.map((detail) => detail.message),
    });
  }
  const { email, verificationCode } = req.body;
  try {
    const user = await verifyVerificationCode({ email, verificationCode });
    return res.status(200).json({
      success: true,
      message: "User verified successfully",
      user,
    });
  } catch (error: any) {
    if (
      error.message === "User does not exist" ||
      error.message === "User is already verified" ||
      error.message === "Verification token not found" ||
      error.message === "Verification code expired"
    ) {
      return res.status(401).send({ error: error.message });
    }
    return res.status(500).send({ error: error.message });
  }
}

interface ChangePasswordRequest extends Request {
  user: {
    userId: string;
  };
  body: {
    oldPassword: string;
    newPassword: string;
  };
}

async function httpChangePassword(
  req: ChangePasswordRequest,
  res: Response
): Promise<Response> {
  const { error } = validateRequest(validateChangePassword, req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details.map((detail) => detail.message),
    });
  }

  const { userId } = req.user;
  const { oldPassword, newPassword } = req.body;

  try {
    console.log(oldPassword, "p");
    const user = await changePassword({
      userId,
      oldPassword,
      newPassword,
    });
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
      user,
    });
  } catch (error: any) {
    if (
      error.message === "User does not exist" ||
      error.message === "Old password is incorrect" ||
      error.message === "User is not verified" ||
      error.message === "New password is same as old password"
    ) {
      return res.status(401).send({ error: error.message });
    }
    return res.status(500).send({ error: error.message });
  }
}

async function httpSendForgotPasswordCode(
  req: { body: { email: string } },
  res: Response
): Promise<Response> {
  const { error } = validateRequest(validateForgotPasswordRequest, req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details.map((detail) => detail.message),
    });
  }

  const { email } = req.body;
  try {
    const user = await sendForgotPasswordCode({ email });
    return res.status(200).json({
      sucess: true,
      message: "Reset code sent sucessfully",
      user,
    });
  } catch (error: any) {
    if (error.message === "User does not exist") {
      return res.status(401).send({ error: error.message });
    }
    return res.status(500).send({ error: error.message });
  }
}

async function httpVerifyForgotPasswordCode(
  req: { body: { email: string; resetCode: string; newPassword: string } },
  res: Response
): Promise<Response> {
  const { error } = validateRequest(validateResetPassword, req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details.map((detail) => detail.message),
    });
  }

  const { email, resetCode, newPassword } = req.body;
  try {
    const user = await verifyForgotPasswordCode({
      email,
      resetCode,
      newPassword,
    });
    return res.status(200).json({
      sucess: true,
      message: "Password reset sucessfully",
      user,
    });
  } catch (error: any) {
    if (
      error.message === "User does not exist" ||
      error.message === "Forgot password token not found" ||
      error.message === "Forgot password token expired"
    ) {
      return res.status(401).send({ error: error.message });
    }
    return res.status(500).send({ error: error.message });
  }
}

module.exports = {
  httpCreateNewUser,
  httpSignIn,
  httpSignOut,
  httpSendVerificationCode,
  httpVerifyVerificationCode,
  httpChangePassword,
  httpSendForgotPasswordCode,
  httpVerifyForgotPasswordCode,
};
