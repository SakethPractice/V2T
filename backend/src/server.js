import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import ttsRoutes from "./routes/ttsRoutes.js";
import sttRoutes from "./routes/sttRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/sessions", sessionRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/tts", ttsRoutes);
app.use("/api/stt", sttRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});