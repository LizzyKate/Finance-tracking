const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookierParser = require("cookie-parser");
const bodyParser = require("body-parser");
const userRouter = require("./routes/user/user.router.ts");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(helmet());
app.use(cookierParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser());
app.use("/", userRouter);

module.exports = app;
