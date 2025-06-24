import moment from "moment-timezone";
import request from "supertest";
import express from "express";
import timezoneRoutes from "routes/timezoneRoutes";

const app = express();
app.use("/api/timezone", timezoneRoutes);

describe("GET /api/timezone", () => {
  it("returns 400 if lat AND lon are missing", async () => {
    const res = await request(app).get("/api/timezone");
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Missing lat/lon" });
  });

  it("returns 400 if only lat OR only lon is provided", async () => {
    const res1 = await request(app).get("/api/timezone?lat=48");
    expect(res1.statusCode).toBe(400);

    const res2 = await request(app).get("/api/timezone?lon=2");
    expect(res2.statusCode).toBe(400);
  });

  it("returns the correct timezone for given coordinates (Paris)", async () => {
    const res = await request(app).get("/api/timezone?lat=48.8566&lon=2.3522");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("timezone");
    expect(res.body).toHaveProperty("name");
    expect(res.body.name).toBe("Europe/Paris");
  });

  it("falls back to offset 0 when timezone cannot be resolved", async () => {
    // Temporarily mock moment.tz.zone to return undefined
    const originalZone = moment.tz.zone;
    jest.spyOn(moment.tz, "zone").mockReturnValueOnce(undefined as any);

    // Call with any lat/lon – the zone is mocked anyway
    const res = await request(app).get("/api/timezone?lat=0&lon=0");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ timezone: 0, name: "Etc/GMT" });
    // Restore the original implementation
    (moment.tz.zone as jest.Mock).mockRestore?.() ??
      (moment.tz.zone = originalZone);
  });
});
