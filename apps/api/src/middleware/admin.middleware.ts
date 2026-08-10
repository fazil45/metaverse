import { prisma } from "@repo/db";
import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../utils/ErrorHandler.js";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, errorMessage: "Unauthenticated" });
    }

    const { role } =
      (await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      })) ?? {};

    if (!role) {
      return res
        .status(401)
        .json({ success: false, errorMessage: "Unauthenticated" });
    }

    if (role !== "Admin") {
      return res
        .status(403)
        .json({ success: false, errorMessage: "Not authorised" });
    }
    next();
  } catch (error) {
    errorHandler({ error, res });
  }
};
