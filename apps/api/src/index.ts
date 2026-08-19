import express, { Application, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/users.routes.js";
import adminRouter from "./routes/admin.routes.js";
import spaceRouter from "./routes/space.routes.js";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "DELETE", "PUT", "GET", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/space", spaceRouter);

app.get("/", async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

export default app;
