import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { SignUpSchema, SignInSchema } from "@workspace/common/types";
import { JWT_SECRET } from "@workspace/backend-common/config";
import { User, connectDB } from "@workspace/nosqldb/client";
import { prisma } from "@workspace/sqlDb/client";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(morgan(":method :url :status :response-time ms"));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

connectDB();

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.post("/signup", async (req, res) => {
  const result = SignUpSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.format());
    return;
  }

  try {
    const user = await prisma.user.create({ data: result.data });
    await User.create(result.data);
    res.status(201).json({ id: user.id, username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.post("/signin", (req, res) => {
  const result = SignInSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.format());
    return;
  }
  res.json({ message: "Validation passed", username: result.data.username });
});

app.listen(port, () =>
  console.log(`Server is running on port: ${port}`)
);
