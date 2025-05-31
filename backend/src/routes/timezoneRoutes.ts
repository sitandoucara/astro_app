import express, { Request, Response } from "express";
import { getTimezone } from "../controllers/timezoneController";

const router = express.Router();

router.get("/", getTimezone as (req: Request, res: Response) => void);

export default router;
