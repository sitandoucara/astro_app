import { Request, Response } from "express";
import {
  getChartFromAPI,
  getPlanetsFromAPI,
} from "../services/astrologyService";
import { generateCompleteChart } from "../services/chartGenerationService";

export const generateChart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const chartData = await getChartFromAPI(req.body);
    res.json(chartData);
  } catch (error: any) {
    console.error("Error generating chart:", error.message);
    res.status(500).json({ error: "Failed to generate chart" });
  }
};

export const getPlanets = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const planets = await getPlanetsFromAPI(req.body);
    res.json(planets);
  } catch (error: any) {
    console.error("Error getting planets:", error.message);
    res.status(500).json({ error: "Failed to get planet positions" });
  }
};

export const generateCompleteUserChart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userAstroData = req.body;
    const requiredFields = [
      "id",
      "dateOfBirth",
      "timeOfBirth",
      "latitude",
      "longitude",
      "timezoneOffset",
    ];
    const missingFields = requiredFields.filter(
      (field) => !userAstroData[field] && userAstroData[field] !== 0
    );

    if (missingFields.length > 0) {
      res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
      return;
    }

    console.log("Generating complete chart for user:", userAstroData.id);

    const result = await generateCompleteChart(userAstroData);

    res.json({
      success: true,
      message: "Chart generated successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error generating complete chart:", error.message);
    res.status(500).json({
      error: "Failed to generate complete chart",
      details: error.message,
    });
  }
};
