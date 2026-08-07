import { Prisma } from "@repo/db";
import { Response } from "express";

export const errorHandler = ({
  error,
  res,
}: {
  error: unknown;
  res: Response;
}) => {
  console.error(error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = (error.meta?.target as string[])?.join(", ") ?? "field";
      return res.status(409).json({
        success: false,
        error: "Unique constraint violation",
        errorMessage: `${target} already exists`,
        code: error.code,
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        success: false,
        error: "Foreign key constraint violation",
        errorMessage: "Invalid reference provided",
        code: error.code,
      });
    }

    return res.status(400).json({
      success: false,
      error: "Database request error",
      errorMessage: "Something went wrong. Please try again.",
      code: error.code,
    });
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(500).json({
      success: false,
      error: "Internal validation error",
      errorMessage: "Something went wrong. Please try again.",
    });
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return res.status(500).json({
      success: false,
      error: "Database engine error",
      errorMessage: "Something went wrong. Please try again.",
    });
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return res.status(503).json({
      success: false,
      error: "Database unavailable",
      errorMessage: "Service is temporarily unavailable. Please try again shortly.",
    });
  }

  return res.status(500).json({
    success: false,
    error: "Internal server error",
    errorMessage: "Something went wrong. Please try again.",
  });
};