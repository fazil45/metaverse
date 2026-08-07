import express, { Application, Request, Response } from "express";
import authRouter from "./routes/auth/auth.routes.js";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

app.get("/", async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

export default app;
