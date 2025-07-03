import { VercelRequest, VercelResponse } from "@vercel/node";
import tzLookup from "tz-lookup";
import { getTimezoneOffset } from "date-fns-tz";

function getTimezoneFromCoords(lat: number, lon: number): string {
  return tzLookup(lat, lon);
}

function getTimezoneOffsetInHours(timezoneName: string): number {
  try {
    const now = new Date();
    const offsetMinutes = getTimezoneOffset(timezoneName, now) / (1000 * 60);
    return -offsetMinutes / 60;
  } catch (error) {
    console.warn(`Failed to get offset for timezone ${timezoneName}, using 0`);
    return 0;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // CORS preflight - required for browsers
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      res.status(400).json({
        error: "Missing lat/lon parameters",
        details: "Both latitude and longitude are required",
      });
      return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({
        error: "Invalid lat/lon values",
        details: "Latitude and longitude must be valid numbers",
      });
      return;
    }

    if (latitude < -90 || latitude > 90) {
      res.status(400).json({
        error: "Invalid latitude",
        details: "Latitude must be between -90 and 90",
      });
      return;
    }

    if (longitude < -180 || longitude > 180) {
      res.status(400).json({
        error: "Invalid longitude",
        details: "Longitude must be between -180 and 180",
      });
      return;
    }

    const timezoneName = getTimezoneFromCoords(latitude, longitude);
    const offsetInHours = getTimezoneOffsetInHours(timezoneName);

    res.status(200).json({
      timezone: offsetInHours,
      name: timezoneName,
    });
  } catch (error: any) {
    console.error("Error getting timezone:", error);

    if (error.message?.includes("Invalid coordinates")) {
      res.status(400).json({
        error: "Invalid coordinates",
        details: error.message,
      });
    } else {
      res.status(500).json({
        error: "Failed to get timezone",
        details: "Internal server error while processing timezone lookup",
      });
    }
  }
}
