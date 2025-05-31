import tzLookup = require("tz-lookup");

export function getTimezoneFromCoords(lat: number, lon: number): string {
  return tzLookup(lat, lon);
}
