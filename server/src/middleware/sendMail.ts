const nodeMailer = require("nodemailer");
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODE_CODE_SENDING_EMAIL,
    pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD,
  },
});
