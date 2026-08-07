import { type Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../utils/imports.js";


export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.Cookie;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "No token provided" });
    }

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decodedInformation = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decodedInformation.id || typeof decodedInformation.id !== "string") {
      return res
        .status(401)
        .json({ success: false, error: "Invalid token payload" });
    }

    req.userId = decodedInformation.id;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: "Token expired",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    console.error("authMiddleware error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};