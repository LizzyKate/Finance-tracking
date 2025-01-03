import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("MONGO_URL environment variable is not defined");
  process.exit(1);
}

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err: Error) => {
  console.error(err);
});

async function mongoConnect() {
  try {
    await mongoose.connect(MONGO_URL as string);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

async function mongoDisconnect() {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error("MongoDB disconnect error:", error);
    throw error;
  }
}

export { mongoConnect, mongoDisconnect };
