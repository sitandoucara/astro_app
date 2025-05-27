import express from "express";
import { generateChart } from "../controllers/chartController";

const router = express.Router();

router.post("/", generateChart);

export default router;
