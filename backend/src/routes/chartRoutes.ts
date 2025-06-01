import express from "express";
import { generateChart, getPlanets } from "../controllers/chartController";

const router = express.Router();

router.post("/", generateChart);
router.post("/planets", getPlanets);

export default router;
