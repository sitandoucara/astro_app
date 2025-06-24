import request from "supertest";
import express from "express";
import timezoneRoutes from "routes/timezoneRoutes";

const app = express();
app.use("/api/timezone", timezoneRoutes);

describe("GET /api/timezone", () => {
  it("should return 400 if lat or lon is missing", async () => {
    const res = await request(app).get("/api/timezone");
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Missing lat/lon" });
  });

  it("should return the correct timezone for given coordinates", async () => {
    //Paris
    const res = await request(app).get("/api/timezone?lat=48.8566&lon=2.3522");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("timezone");
    expect(res.body).toHaveProperty("name");
    expect(res.body.name).toBe("Europe/Paris");
  });
});
