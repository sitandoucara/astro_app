import { Request, Response } from "express";
import { getChartFromAPI } from "../services/astrologyService";

export const generateChart = async (req: Request, res: Response) => {
  try {
    const chartData = await getChartFromAPI(req.body);
    res.json(chartData);
  } catch (error: any) {
    console.error("Error generating chart:", error.message);
    res.status(500).json({ error: "Failed to generate chart" });
  }
};
