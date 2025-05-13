import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config();

const app = express();

// CORS Configuration
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://splendorous-croissant-00662d.netlify.app"]
    : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins, // Dynamic origins based on environment
    credentials: true, // Allow cookies with CORS requests
  })
);

// Middlewares
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/v1", appRouter);

app.get("/", (req, res) => {
  res.send("Backend.");
});

export default app;
