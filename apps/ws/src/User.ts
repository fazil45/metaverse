import WebSocket from "ws";
import { RoomManager } from "./RoomManager.js";
import { OutgoingMessage } from "./types.js";
import { prisma } from "@repo/db";
import jwt, { JwtPayload } from "jsonwebtoken";

function getRandomString(length: number) {
  const charaters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let results = "";

  for (let i = 0; i < length; i++) {
    results += charaters.charAt(Math.random() * charaters.length);
  }
  return results;
}

export class User {
  public id: string;
  public userId?: string;
  private spaceId?: string;
  private x: number;
  private y: number;

  constructor(private ws: WebSocket) {
    this.id = getRandomString(10);
    this.x = 0;
    this.y = 0;
    this.initHandlers();
  }

  initHandlers() {
    this.ws.on("message", async (data) => {
      const parsedData = JSON.parse(data.toString());
      try {
        switch (parsedData.type) {
          case "join":
            const spaceId = parsedData.payload.spaceId;
            const token = parsedData.payload.Cookie;
            const userId = (
              jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
            ).id;
            if (!userId) {
              this.ws.close();
              return;
            }
            this.userId = userId;
            const space = await prisma.space.findFirst({
              where: {
                id: spaceId,
              },
            });
            if (!space) {
              this.ws.close();
              return;
            }
            this.spaceId = spaceId;
            RoomManager.getInstance().addUser(spaceId, this);
            this.x = Math.floor(Math.random() * space.width);
            this.y = Math.floor(Math.random() * space.height);
            this.send({
              type: "space-joined",
              payload: {
                spawn: {
                  x: this.x,
                  y: this.y,
                },
                users:
                  RoomManager.getInstance()
                    .rooms.get(spaceId)
                    ?.map((u) => ({ id: u.id })) ?? [],
              },
            });
            RoomManager.getInstance().broadcast(
              {
                type: "user-joined",
                payload: {
                  userId: this.userId,
                  x: this.x,
                  y: this.y,
                },
              },
              this,
              this.spaceId!,
            );
            break;
          case "move":
            const moveX = parsedData.payload.x;
            const moveY = parsedData.payload.y;
            const xDisplacement = Math.abs(this.x - moveX);
            const yDisplacement = Math.abs(this.y - moveY);
            if (
              (xDisplacement == 1 && yDisplacement == 0) ||
              (xDisplacement == 0 && yDisplacement == 1)
            ) {
              this.x = moveX;
              this.y = moveY;
              RoomManager.getInstance().broadcast(
                {
                  type: "move",
                  payload: {
                    x: this.x,
                    y: this.y,
                  },
                },
                this,
                this.spaceId!,
              );
            }

            this.send({
              type: "movement-rejected",
              payload: {
                x: this.x,
                y: this.y,
              },
            });
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  destroy() {
    RoomManager.getInstance().broadcast(
      {
        type: "user-left",
        payload: {
          userId: this.userId,
        },
      },
      this,
      this.spaceId!,
    );
  }

  send(payload: OutgoingMessage) {
    this.ws.send(JSON.stringify(payload));
  }
}
