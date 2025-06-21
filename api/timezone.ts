import { VercelRequest, VercelResponse } from "@vercel/node";
import tzLookup from "tz-lookup";
import moment from "moment-timezone";

function getTimezoneFromCoords(lat: number, lon: number): string {
  return tzLookup(lat, lon);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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
      res.status(400).json({ error: "Missing lat/lon parameters" });
      return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({ error: "Invalid lat/lon values" });
      return;
    }

    const timezoneName = getTimezoneFromCoords(latitude, longitude);
    const offset = moment.tz.zone(timezoneName)?.utcOffset(Date.now()) ?? 0;
    const offsetInHours = offset / 60;

    res.json({
      timezone: offsetInHours,
      name: timezoneName,
    });
  } catch (error: any) {
    console.error("Error getting timezone:", error.message);
    res.status(500).json({
      error: "Failed to get timezone",
      details: error.message,
    });
  }
}
