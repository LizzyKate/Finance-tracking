import { User } from "./user.mongo";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { transporter } from "../middleware/sendMail";
import crypto from "crypto";
import e from "express";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY;
const CODE_SECRET = process.env.NODE_VERIFICATION_CODE_SECRET;

interface UserInput {
  email: string;
  password: string;
  verified?: boolean;
  verificationToken?: string;
  verificationTokenValidation?: number;
}

async function createUser(user: UserInput) {
  try {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(String(user.password), 10);

    const newUser = new User({
      email: user.email,
      password: hashedPassword,
      userId: uuidv4(),
    });
    await newUser.save();
    return newUser;
  } catch (error) {
    throw error;
  }
}

async function signIn(user: UserInput) {
  try {
    const existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
      throw new Error("User does not exist");
    }

    const isPasswordCorrect = await bcrypt.compare(
      String(user.password),
      existingUser.password
    );
    if (!isPasswordCorrect) {
      throw new Error("Password is incorrect");
    }

    const token = jwt.sign(
      {
        userId: existingUser.userId,
        email: existingUser.email,
        verified: existingUser.verified,
      },
      JWT_SECRET!,
      { expiresIn: JWT_EXPIRY }
    );

    return {
      token,
      user: {
        email: existingUser.email,
        userId: existingUser.userId,
      },
    };
  } catch (error) {
    console.error("Error in signIn:", error);
    throw error;
  }
}

async function sendVerificationCode(user: { email: string }) {
  try {
    const existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
      throw new Error("User does not exist");
    }
    if (existingUser.verified) {
      throw new Error("User is already verified");
    }

    const codeValue = Math.floor(Math.random() * 1000000).toString();
    let info = await transporter.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL,
      to: user.email,
      subject: "Verification Code",
      html: `<b>Your verification code is: ${codeValue}</b>`,
    });
    if (info.accepted[0] === user.email) {
      const hashedCodeValue = crypto
        .createHmac("sha256", codeValue)
        .update(CODE_SECRET!)
        .digest("hex");
      await User.updateOne(
        { email: user.email },
        {
          verificationToken: hashedCodeValue,
          verificationTokenValidation: Date.now(),
        }
      );
      return { message: "Verification code sent" };
    }
  } catch (error) {
    console.error("Error in verifyUser:", error);
    throw error;
  }
}

async function verifyVerificationCode(user: {
  email: string;
  verificationCode: string;
}) {
  try {
    const codeValue = user.verificationCode;
    const existingUser = await User.findOne({ email: user.email }).select(
      "+verificationToken +verificationTokenValidation"
    );

    if (!existingUser) {
      throw new Error("User does not exist");
    }
    if (existingUser.verified) {
      throw new Error("User is already verified");
    }

    if (
      !existingUser.verificationToken ||
      !existingUser.verificationTokenValidation
    ) {
      throw new Error("Verification token not found");
    }

    if (Date.now() - existingUser.verificationTokenValidation > 1000 * 60 * 5) {
      throw new Error("Verification code expired");
    }

    const hashedCodeValue = crypto
      .createHmac("sha256", codeValue)
      .update(CODE_SECRET!)
      .digest("hex");

    if (hashedCodeValue === existingUser.verificationToken) {
      existingUser.verified = true;
      existingUser.verificationToken = undefined;
      existingUser.verificationTokenValidation = undefined;
      await existingUser.save();
    }
  } catch (error) {
    console.error("Error in verifyVerificationCode:", error);
    throw error;
  }
}

async function changePassword(user: {
  userId: string;
  oldPassword: string;
  newPassword: string;
}) {
  try {
    const existingUser = await User.findOne({ _id: user.userId }).select(
      "+password +verified"
    );
    if (!existingUser) {
      throw new Error("User does not exist");
    }

    const isPasswordCorrect = await bcrypt.compare(
      user.oldPassword,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      throw new Error("Old password is incorrect");
    }

    if (!existingUser.verified) {
      throw new Error("User is not verified");
    }
    if (user.oldPassword === user.newPassword) {
      throw new Error("New password is same as old password");
    }

    const hashedPassword = await bcrypt.hash(user.newPassword, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();
  } catch (error) {
    console.error("Error in changePassword:", error);
    throw error;
  }
}

export {
  createUser,
  signIn,
  sendVerificationCode,
  verifyVerificationCode,
  changePassword,
};
