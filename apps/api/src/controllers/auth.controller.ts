import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SignInSchema, SignUpSchema } from "@repo/zodschema";
import { Prisma, prisma, Role } from "@repo/db";
import { JWT_SECRET } from "../utils/imports.js";
import { CookieOption } from "../utils/cookie-options.js";
import { errorHandler } from "../utils/ErrorHandler.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const parsedSignUpData = SignUpSchema.safeParse(req.body);

    if (!parsedSignUpData.success) {
      return res.status(400).json({
        success: false,
        errorMessage: "Invalid inputs",
      });
    }

    const { password, username, avatarId } = parsedSignUpData.data;

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

    const hashedPassword = await bcrypt.hash(password, 12);
    const role = req.body.role as Role;

    const createData = {
      username: username,
      password: hashedPassword,
      avatarId: avatarId,
      role: role,
    };

    const user = await prisma.user.create({ data: createData });

    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    errorHandler({ error, res });
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
        .status(403)
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

    res.status(200).cookie("Cookie", token, CookieOption).json({
      success: true,
      message: "Signin successfully",
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        avatarId: true,
        role: true,
        username: true,
      },
    });

    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.error(error);
    errorHandler({ error, res });
  }
};

export const signout = async (req: Request, res: Response) => {
  try {
    res
      .clearCookie("Cookie")
      .json({ success: true, message: "Signout successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      errorMessage: "Server error",
    });
  }
};
