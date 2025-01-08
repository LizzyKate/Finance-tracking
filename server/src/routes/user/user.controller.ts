const {
  createUser,
  signIn,
  sendVerificationCode,
  verifyVerificationCode,
  changePassword,
} = require("../../models/user.model");
import { validateUser } from "../../middleware/validator";
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
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ error: "Email and password are required" });
  }
  try {
    const { error, value }: ValidationResult = validateUser({
      email,
      password,
    });
    if (error) {
      return res
        .status(401)
        .send({ success: false, error: error.details[0].message });
    }
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
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .send({ success: false, error: "Email and password are required" });
  }

  try {
    const { error, value }: ValidationResult = validateUser({
      email,
      password,
    });
    if (error) {
      return res
        .status(401)
        .send({ success: false, error: error.details[0].message });
    }
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
    password: string;
    newPassword: string;
  };
}

async function httpChangePassword(
  req: ChangePasswordRequest,
  res: Response
): Promise<Response> {
  const { userId } = req.user;
  const { password, newPassword } = req.body;
  if (!password || !newPassword) {
    return res
      .status(400)
      .send({ error: "Password and new password are required" });
  }

  try {
    const user = await changePassword({
      userId,
      password,
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

module.exports = {
  httpCreateNewUser,
  httpSignIn,
  httpSignOut,
  httpSendVerificationCode,
  httpVerifyVerificationCode,
  httpChangePassword,
};
