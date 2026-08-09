import {
  CreateAvatarSchema,
  CreateElementSchema,
  CreateMapSchema,
  ElementIdParamsSchema,
  UpdateElementSchema,
} from "@repo/zodschema";
import { Request, Response } from "express";
import { errorHandler } from "../utils/ErrorHandler.js";
import { prisma } from "@repo/db";

export const createElement = async (req: Request, res: Response) => {
  try {
    const parsedCreateElementData = CreateElementSchema.safeParse(req.body);

    if (!parsedCreateElementData.success) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "Invalid inputs" });
    }

    const { height, imageUrl, static, width } = parsedCreateElementData.data;

    const element = await prisma.element.create({
      data: {
        width: width,
        height: height,
        imageUrl: imageUrl,
        static: static,
      },
    });

    res.status(200).json({
      success: true,
      message: "Element created",
      id: element.id,
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};

export const updateElement = async (req: Request, res: Response) => {
  try {
    const parsedElementId = ElementIdParamsSchema.safeParse(req.params);

    if (!parsedElementId.success) {
      return res.status(400).json({
        success: false,
        errorMessage: "Invalid inputs",
      });
    }

    const elementId = parsedElementId.data.elementId;

    const parsedUpdateElementData = UpdateElementSchema.safeParse(req.body);

    if (!parsedUpdateElementData.success) {
      return res.status(400).json({
        success: false,
        errorMessage: "Invalid inputs",
      });
    }

    const imageUrl = parsedUpdateElementData.data.imageUrl;

    await prisma.element.update({
      where: {
        id: elementId,
      },
      data: {
        imageUrl: imageUrl,
      },
    });

    res.status(200).json({
      success: true,
      message: "Element updated",
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};

export const createAvatar = async (req: Request, res: Response) => {
  try {
    const parsedUpdateElementData = CreateAvatarSchema.safeParse(req.body);

    if (!parsedUpdateElementData.success) {
      return res.status(400).json({
        success: false,
        errorMessage: "Invalid inputs",
      });
    }

    const { imageUrl, name } = parsedUpdateElementData.data;

    const avatar = await prisma.avatar.create({
      data: {
        imageUrl: imageUrl,
        name: name,
      },
    });

    res.status(200).json({
      success: true,
      message: "Avatar created successfully",
      id: avatar.id,
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};

export const createMap = async (req: Request, res: Response) => {
  try {
    const parsedUpdateElementData = CreateMapSchema.safeParse(req.body);

    if (!parsedUpdateElementData.success) {
      return res.status(400).json({
        success: false,
        errorMessage: "Invalid inputs",
      });
    }

    const { defaultElements, dimensions, thumbnail, name } =
      parsedUpdateElementData.data;

    const map = await prisma.map.create({
      data: {
        name: name,
        width: parseInt(dimensions.split("x")[0]!),
        height: parseInt(dimensions.split("x")[1]!),
        thumbnail: thumbnail,
        mapElements: {
          create: defaultElements.map((e) => ({
            elementId: e.elementId,
            x: e.x,
            y: e.y,
          })),
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Map created successfully",
      id: map.id,
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};
