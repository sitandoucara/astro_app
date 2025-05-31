import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import chartRoutes from "./routes/chartRoutes";
import timezoneRoutes from "./routes/timezoneRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/chart", chartRoutes);
app.use("/api/timezone", timezoneRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
