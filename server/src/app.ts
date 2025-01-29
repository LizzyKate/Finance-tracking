const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookierParser = require("cookie-parser");
const userRouter = require("./routes/user/user.router.ts");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Add this to allow credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cookierParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", userRouter);

module.exports = app;
