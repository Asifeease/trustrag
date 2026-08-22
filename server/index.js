/**
 * TrustRAG Backend Server
 * Node.js + Express + RAG Legal Assistant Engine
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import apiRouter from "./routes/api.js";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", "*"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging in dev
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[TrustRAG API] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use("/api", apiRouter);

// Serve static frontend files if built for production
const distPath = path.resolve(__dirname, "../dist");
app.use(express.static(distPath));

// Catch-all route to serve SPA or status
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) {
      res.json({
        service: "TrustRAG Backend API Server",
        message: "API server is running. Access API endpoints under /api/*",
        health: "/api/health"
      });
    }
  });
});

// Global Error Handler
app.use((err, _req, res, next) => {
  if (res.headersSent) return next(err);
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 TrustRAG Backend Server running on: http://localhost:${PORT}`);
  console.log(`⚖️  Legal Knowledge Engine: Ready`);
  console.log(`🛡️  Trust Scoring Service: Ready`);
  console.log(`=========================================`);
});
