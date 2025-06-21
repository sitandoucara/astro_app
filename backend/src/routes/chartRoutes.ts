import express from "express";
import {
  generateChart,
  getPlanets,
  generateCompleteUserChart,
} from "../controllers/chartController";

const router = express.Router();

router.post("/", generateChart);
router.post("/planets", getPlanets);

router.post("/generate-complete", generateCompleteUserChart);

export default router;
