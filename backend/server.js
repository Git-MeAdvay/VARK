import express from "express";
import cors from "cors";
import testRoutes from "./routes/test.routes.js";
import loginRoutes from "./routes/login.routes.js";
import studentRoutes from "./routes/student.routes.js";
import { connectDB } from "./config/db.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/test", testRoutes);
app.use("/login", loginRoutes);
app.use("/student", studentRoutes);
app.get("/", (req,res) => {
    res.send("API is running...");
  }
);


if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;