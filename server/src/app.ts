const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./routes/user/user.router.js");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(bodyParser());

app.use(express.json());
app.use("/", userRouter);

module.exports = app;
