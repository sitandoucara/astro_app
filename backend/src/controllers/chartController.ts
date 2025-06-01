import { Request, Response } from "express";
import {
  getChartFromAPI,
  getPlanetsFromAPI,
} from "../services/astrologyService";

export const generateChart = async (req: Request, res: Response) => {
  try {
    const chartData = await getChartFromAPI(req.body);
    res.json(chartData);
  } catch (error: any) {
    console.error("Error generating chart:", error.message);
    res.status(500).json({ error: "Failed to generate chart" });
  }
};

export const getPlanets = async (req: Request, res: Response) => {
  try {
    const planets = await getPlanetsFromAPI(req.body);
    res.json(planets);
  } catch (error: any) {
    console.error("Error getting planets:", error.message);
    res.status(500).json({ error: "Failed to get planet positions" });
  }
};
