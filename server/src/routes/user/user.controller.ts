const { createUser, signIn, verifyUser } = require("../../models/user.model");
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
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      send: { (arg0: { error: any }): any; new (): any };
      json: {
        (arg0: { success: boolean; message: string; user: any }): void;
        new (): any;
      };
    };
    cookie: (
      arg0: string,
      arg1: string,
      arg2: {
        httpOnly: boolean;
        secure: boolean;
        sameSite: string;
        maxAge: number;
      }
    ) => void;
  }
) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ error: "Email and password are required" });
  }

  try {
    const { error, value }: ValidationResult = validateUser({
      email,
      password,
    });
    const user = await signIn({ email, password });
    const jwtExpiryInSeconds = parseInt(process.env.JWT_EXPIRY || "3600", 10);

    res.cookie("Authorization", "Bearer " + user.token, {
      httpOnly: process.env.NODE_ENV === "production" ? true : false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: jwtExpiryInSeconds * 1000,
    });
    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      user,
    });
  } catch (error: any) {
    if (
      error.message === "User does not exist" ||
      error.message === "Password is incorrect"
    ) {
      return res.status(401).send({ error: error.message });
    }
    return res.status(500).send({ error: error.message });
  }
}

async function httpSignOut(
  req: any,
  res: {
    clearCookie: (arg0: string) => void;
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: {
        (arg0: { success: boolean; message: string }): void;
        new (): any;
      };
    };
  }
) {
  res.clearCookie("Authorization");
  res.status(200).json({ success: true, message: "User signed out" });
}

async function httpVerifyUser(
  req: VerifyUserRequest,
  res: Response
): Promise<Response> {
  const { email } = req.body;
  try {
    const user = await verifyUser({ email });
    return res.status(200).json({
      success: true,
      message: "User verified successfully",
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

module.exports = {
  httpCreateNewUser,
  httpSignIn,
  httpSignOut,
  httpVerifyUser,
};