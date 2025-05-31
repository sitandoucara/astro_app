import { Request, Response } from "express";
import { getTimezoneFromCoords } from "../utils/timezoneUtils";
import moment from "moment-timezone";

export const getTimezone = (req: Request, res: Response) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat/lon" });
  }

  const timezoneName = getTimezoneFromCoords(
    parseFloat(lat as string),
    parseFloat(lon as string)
  );

  const offset = moment.tz.zone(timezoneName)?.utcOffset(Date.now()) ?? 0;
  const offsetInHours = offset / 60;

  return res.json({ timezone: offsetInHours, name: timezoneName });
};
