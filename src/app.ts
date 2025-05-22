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
    ? ["https://home-remedy-chatbot-1wp0.onrender.com", "https://splendorous-croissant-00662d.netlify.app"]
    : ["http://localhost:5173"];

app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
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

app.get("/test", (req, res) => {
  res.send("Test route is working");
});

export default app;
