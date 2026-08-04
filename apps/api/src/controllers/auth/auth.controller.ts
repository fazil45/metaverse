import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SignInSchema, SignUpSchema } from "@repo/zodschema";
import { Prisma, prisma, Role } from "@repo/db";
import { JWT_SECRET } from "../../utils/imports.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const parsedSignUpData = SignUpSchema.safeParse(req.body);

    if (!parsedSignUpData.success) {
      return res.status(400).json({
        success: false,
        errorMessage: "Invalid inputs",
      });
    }

    const { password, username, avatarId, role } = parsedSignUpData.data;

    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (userAlreadyExists) {
      return res.status(401).json({
        success: false,
        errorMessage: "username already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 15);

    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        avatarId: avatarId,
        role: role as Role,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error(error);

    // Prisma-specific known errors (constraint violations, FK errors, etc.)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Unique constraint violation (race condition: two signups at once)
      if (error.code === "P2002") {
        return res.status(409).json({
          success: false,
          errorMessage: `Username already taken`,
        });
      }

      // Foreign key constraint failure (e.g. invalid avatarId)
      if (error.code === "P2003") {
        return res.status(400).json({
          success: false,
          errorMessage: "Invalid reference — avatarId does not exist",
        });
      }

      // Fallback for other known Prisma errors
      return res.status(400).json({
        success: false,
        error: "Database request error",
        errorMessage: "Server error",
        code: error.code,
      });
    }

    // Malformed query itself (bug in your Prisma call, not user input)
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(500).json({
        success: false,
        errorMessage: "Internal validation error",
      });
    }

    // Prisma engine crashed/panicked
    if (error instanceof Prisma.PrismaClientRustPanicError) {
      return res.status(500).json({
        success: false,
        error: "Database engine error",
        errorMessage: "Server error",
      });
    }

    // Prisma couldn't connect to the DB at all
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return res.status(503).json({
        success: false,
        error: "Database unavailable",
        errorMessage: "Server error",
      });
    }

    // bcrypt or anything else unexpected
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      errorMessage: "Server error",
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const parsedSigninData = SignInSchema.safeParse(req.body);

    if (!parsedSigninData.success) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "Invalid inputs" });
    }

    const { username, password } = parsedSigninData.data;

    const checkUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!checkUser) {
      return res
        .status(404)
        .json({ success: false, errorMessage: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, checkUser.password);

    if (!matchPassword) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "Invalid inputs" });
    }

    const token = jwt.sign(
      {
        id: checkUser.id,
        role: checkUser.role,
      },
      JWT_SECRET,
    );
  } catch (error) {}
};

export const me = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

export const signout = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
