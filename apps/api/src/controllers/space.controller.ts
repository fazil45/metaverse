import {
  AddElementSchema,
  CreateElementSchema,
  CreateSpaceSchema,
  DeleteElementSchema,
  SpaceIdParamsSchema,
} from "@repo/zodschema";
import { Request, Response } from "express";
import { errorHandler } from "../utils/ErrorHandler.js";
import { prisma } from "@repo/db";

export const createSpace = async (req: Request, res: Response) => {
  try {
    const parsedCreateSpaceData = CreateSpaceSchema.safeParse(req.body);

    if (!parsedCreateSpaceData.success) {
      return res.status(400).json({
        success: false,
        errorMessage: "Invalid inputs",
      });
    }

    const { name, dimensions, mapId } = parsedCreateSpaceData.data;

    if (!parsedCreateSpaceData.data.mapId) {
      const space = await prisma.space.create({
        data: {
          name,
          width: Number(dimensions.split("x")[0]),
          height: Number(dimensions.split("y")[1]),
          creatorId: req.userId,
        },
      });

      res
        .status(200)
        .json({ success: true, message: "Space created", spaceId: space.id });
    }

    const map = await prisma.map.findUnique({
      where: {
        id: mapId,
      },
      select: {
        mapElements: true,
        height: true,
        width: true,
      },
    });

    if (!map) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "Map not found" });
    }

    let space = await prisma.$transaction(async () => {
      const space = await prisma.space.create({
        data: {
          name,
          width: map.width,
          height: map.height,
          creatorId: req.userId,
        },
      });

      await prisma.spaceElements.createMany({
        data: map.mapElements.map((e) => ({
          spaceId: space.id,
          elementId: e.elementId,
          x: e.x!,
          y: e.y!,
        })),
      });

      return space;
    });

    res.status(201).json({
      success: true,
      message: "Space created successfully",
      spaceId: space.id,
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};

export const deleteSpace = async (req: Request, res: Response) => {
  try {
    const parsedSpaceId = SpaceIdParamsSchema.safeParse(req.params);

    if (!parsedSpaceId.success) {
      return res
        .status(400)
        .json({ success: true, errorMessage: "Invalid inputs" });
    }

    const spaceId = parsedSpaceId.data.spaceId;

    const space = await prisma.space.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        creatorId: true,
      },
    });

    if (!space) {
      return res
        .status(404)
        .json({ success: false, errorMessage: "Space not found" });
    }

    if (space.creatorId !== req.userId) {
      return res.status(403).json({ errorMessage: "Unauthorised" });
    }

    await prisma.space.delete({
      where: {
        id: spaceId,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Space deleted successfully" });
  } catch (error) {
    errorHandler({ error, res });
  }
};

export const getAllSpaces = async (req: Request, res: Response) => {
  try {
    const spaces = await prisma.space.findMany({
      where: {
        creatorId: req.userId,
      },
    });

    res.status(200).json({
      success: true,
      spaces: spaces.map((s) => ({
        id: s.id,
        name: s.name,
        thumbnail: s.thumbnail,
        dimensions: `${s.width}x${s.height}`,
      })),
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};

export const addElementInSpace = async (req: Request, res: Response) => {
  try {
    const parsedCreateElementData = AddElementSchema.safeParse(req.body);

    if (!parsedCreateElementData.success) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "Invalid inputs" });
    }

    const { elementId, spaceId, x, y } = parsedCreateElementData.data;

    const space = await prisma.space.findUnique({
      where: {
        id: spaceId,
        creatorId: req.userId,
      },
      select: {
        width: true,
        height: true,
      },
    });

    if (!space) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "No space found" });
    }

    await prisma.spaceElements.create({
      data: {
        spaceId: spaceId,
        elementId: elementId,
        x: x,
        y: y,
      },
    });

    res.status(200).json({ success: true, message: "Element added" });
  } catch (error) {
    errorHandler({ error, res });
  }
};

export const deleteElementInSpace = async (req: Request, res: Response) => {
  try {
    const parsedDeleteElementData = DeleteElementSchema.safeParse(req.body);

    if (!parsedDeleteElementData.success) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "Invalid inputs" });
    }

    const id = parsedDeleteElementData.data.id;

    const spaceElement = await prisma.spaceElements.findFirst({
      where: {
        id: id,
      },
      include: {
        space: true,
      },
    });

    if (
      !spaceElement?.space.creatorId ||
      spaceElement.space.creatorId !== req.userId
    ) {
      res.status(400).json({ success: false, errorMessage: "Unauthorized" });
    }

    await prisma.spaceElements.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({ success: true, message: "Element deleted" });
  } catch (error) {
    errorHandler({ error, res });
  }
};

export const getSpace = async (req: Request, res: Response) => {
  try {
    const parsedSpaceId = SpaceIdParamsSchema.safeParse(req.body);

    if (!parsedSpaceId.success) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "Invalid inputs" });
    }

    const spaceId = parsedSpaceId.data.spaceId;

    const space = await prisma.space.findUnique({
      where: {
        id: spaceId,
      },
      include: {
        elements: {
          include: {
            element: true,
          },
        },
      },
    });

    if (!space) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "Space not found" });
    }

    res.status(200).json({
      success: true,
      space: {
        dimensions: `${space.width}x${space.height}`,
        elements: space.elements.map((e) => ({
          id: e.id,
          element: {
            id: e.element.id,
            imageUrl: e.element.imageUrl,
            width: e.element.width,
            height: e.element.height,
            static: e.element.static,
          },
          x: e.x,
          y: e.y,
        })),
      },
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};
