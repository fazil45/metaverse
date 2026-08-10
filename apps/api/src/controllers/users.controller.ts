import { UpdateUserMetadata } from "@repo/zodschema";
import { Request, Response } from "express";
import { errorHandler } from "../utils/ErrorHandler.js";
import { prisma } from "@repo/db";

export const updateUserMetadata = async (req: Request, res: Response) => {
  try {
    const parsedUpdateMetadataData = UpdateUserMetadata.safeParse(req.body);

    if (!parsedUpdateMetadataData.success) {
      return res.status(400).json({
        success: false,
        errorMessage: "Invalid inputs",
      });
    }

    const avatarId = parsedUpdateMetadataData.data.avatarId;

    const avatarIdResponse = await prisma.user.update({
      where: {
        id: req.userId,
      },
      data: {
        avatarId: avatarId,
      },
    });

    res.status(200).json({
      success: true,
      message: "avatar updated",
      avatarId: avatarId,
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};

export const getAllAvatars = async (req: Request, res: Response) => {
  try {
    const avatars = await prisma.avatar.findMany();

    res.status(200).json({
      success: true,
      avatars: avatars.map((x) => ({
        id: x.id,
        imageUrl: x.imageUrl,
        name: x.name,
      })),
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};

export const getAllElements = async (req: Request, res: Response) => {
  try {
    const elements = await prisma.element.findMany();
    res.status(200).json({
      success: true,
      elements: elements.map((x) => ({
        id: x.id,
        imageUrl: x.imageUrl,
        width: x.width,
        height: x.height,
        position: x.position,
      })),
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};
export const getUsersMetadata = async (req: Request, res: Response) => {
  try {
    const userIdAsString = (req.query.ids ?? "[]") as string;
    const userIds = userIdAsString
      .slice(1, userIdAsString.length - 2)
      .split(",");

    const metadata = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        avatar: true,
        id: true,
      },
    });

    res.json({
      success: true,
      avatars: metadata.map((m) => ({
        userId: m.id,
        avatarId: m.avatar?.imageUrl,
        name: m.avatar?.name,
      })),
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};
