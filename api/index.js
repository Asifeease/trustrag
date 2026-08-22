/**
 * Vercel Serverless Function entry point
 * Bridges Express backend routes for serverless deployment
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "../server/routes/api.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Mount API router
app.use("/api", apiRouter);

export default app;
