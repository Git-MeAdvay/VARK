import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api.routes.js";
import { connectDB } from "./config/db.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api", apiRoutes);

export default app;