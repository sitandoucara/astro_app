import { Request, Response } from "express";
import { getTimezoneFromCoords } from "../utils/timezoneUtils";
import { getTimezoneOffset } from "date-fns-tz";

export const getTimezone = (req: Request, res: Response) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat/lon" });
  }

  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lon as string);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: "Invalid lat/lon values" });
  }

  try {
    const timezoneName = getTimezoneFromCoords(latitude, longitude);

    const now = new Date();
    const offsetMs = getTimezoneOffset(timezoneName, now);
    const offsetInHours = -offsetMs / (1000 * 60 * 60);

    return res.json({ timezone: offsetInHours, name: timezoneName });
  } catch (error) {
    console.error("Failed to compute timezone:", error);
    return res.status(500).json({
      error: "Failed to determine timezone",
      details: (error as Error).message,
    });
  }
};
