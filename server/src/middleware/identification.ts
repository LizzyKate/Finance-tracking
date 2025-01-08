import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

exports.identifier = async (
  req: {
    headers: { client: string; authorization: any };
    cookies: { Authorization: any };
    user: string | jwt.JwtPayload;
  },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: { success: boolean; message: string }): any; new (): any };
    };
  },
  next: () => void
) => {
  let token;
  if (req.headers.client === "not-browser") {
    token = req.headers.authorization;
  } else {
    token = req.cookies.Authorization;
  }
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const userToken = token.split(" ")[1];
    if (!JWT_SECRET) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
    const jwtVerified = jwt.verify(userToken, JWT_SECRET);
    if (jwtVerified) {
      req.user = jwtVerified;
      next();
    } else {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
