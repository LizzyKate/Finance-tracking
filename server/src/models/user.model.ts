import { User } from "./user.mongo";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY;

interface UserInput {
  email: string;
  password: string;
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

export { createUser, signIn };
