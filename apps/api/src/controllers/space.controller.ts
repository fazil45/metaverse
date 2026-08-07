import { CreateSpaceSchema } from "@repo/zodschema";
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

    res
      .status(201)
      .json({
        success: true,
        message: "Space created successfully",
        spaceId: space.id,
      });
  } catch (error) {
    errorHandler({ error, res });
  }
};

export const deleteSpace = async (req:Request, res:Response) => {
    try {
        const space = await prisma.space.findUnique({
            where:{
                id:req.userId
            },
            select:{
                creatorId:true
            }
        })

        if (!space) {
            return res.status(404).json({success:false,errorMessage:"Space not found"})
        }

        if (space.creatorId !== req.userId) {
            return res.status(403).json({errorMessage:"Unauthorised"})
        }

        await prisma.space.delete({
            where:{
                id:req.params.spaceId
            }
        })
    } catch (error) {
        
    }
}