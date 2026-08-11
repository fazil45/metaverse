import { WebSocketServer } from "ws";
import { User } from "./User.js";

const wss = new WebSocketServer({ port: 4001 });

wss.on("connection", function connection(ws) {
  let user: User | undefined;
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    user = new User(ws);
  });

  ws.on("close", () => {
    user?.destroy();
  });

  ws.send("something");
});
