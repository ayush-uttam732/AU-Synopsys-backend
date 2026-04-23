import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import generateRoute from "./routes/generate.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 route connect

app.get("/", (req, res) => {
  res.send("🚀 Backend is live");
});

app.use("/api", generateRoute);

app.listen(5000, () => {
  console.log("Server running on 5000 🚀");
});