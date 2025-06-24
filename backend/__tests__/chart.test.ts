import request from "supertest";
import express from "express";
import chartRoutes from "../src/routes/chartRoutes";

// 1* Mock every service the controller relies on

jest.mock("../src/services/astrologyService", () => ({
  getChartFromAPI: jest.fn().mockResolvedValue({ output: "<svg />" }),
  getPlanetsFromAPI: jest
    .fn()
    .mockResolvedValue({ output: [{ planet: { en: "Sun" } }] }),
}));

jest.mock("../src/services/chartGenerationService", () => ({
  generateCompleteChart: jest.fn().mockResolvedValue({
    success: true,
    chartUrl: "https://supabase.storage/charts/user123.svg",
    planets: { Sun: "Aries" },
    ascendant: { sign: "Leo" },
  }),
}));

import {
  getChartFromAPI,
  getPlanetsFromAPI,
} from "../src/services/astrologyService";
import { generateCompleteChart } from "../src/services/chartGenerationService";

// 2* Set up a minimal Express app

const app = express();
app.use(express.json());
app.use("/api/chart", chartRoutes);

// Test payload
const samplePayload = {
  year: 1999,
  month: 12,
  date: 31,
  hours: 23,
  minutes: 59,
  seconds: 0,
  latitude: 48.85,
  longitude: 2.35,
  timezone: +1,
};

// 3* Tests

describe("Chart routes", () => {
  afterEach(() => jest.clearAllMocks());

  // ───── generateChart
  it("POST /api/chart → returns chart SVG data", async () => {
    const res = await request(app).post("/api/chart").send(samplePayload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ output: "<svg />" });
    expect(getChartFromAPI).toHaveBeenCalledWith(samplePayload);
  });

  it("POST /api/chart → 500 on service failure", async () => {
    (getChartFromAPI as jest.Mock).mockRejectedValueOnce(new Error("boom"));
    const res = await request(app).post("/api/chart").send(samplePayload);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Failed to generate chart" });
  });

  // ───── getPlanets
  it("POST /api/chart/planets → returns planet positions", async () => {
    const res = await request(app)
      .post("/api/chart/planets")
      .send(samplePayload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ output: [{ planet: { en: "Sun" } }] });
    expect(getPlanetsFromAPI).toHaveBeenCalledWith(samplePayload);
  });

  it("POST /api/chart/planets → 500 on service failure", async () => {
    (getPlanetsFromAPI as jest.Mock).mockRejectedValueOnce(new Error("fail"));
    const res = await request(app)
      .post("/api/chart/planets")
      .send(samplePayload);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Failed to get planet positions" });
  });

  // ───── generateCompleteUserChart
  it("POST /api/chart/generate-complete → 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/chart/generate-complete")
      // missing the rest
      .send({ id: "user123" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Missing required fields/);
    expect(generateCompleteChart).not.toHaveBeenCalled();
  });

  it("POST /api/chart/generate-complete → returns full chart payload", async () => {
    const fullPayload = {
      id: "user123",
      dateOfBirth: "1999-12-31",
      timeOfBirth: "23:59",
      latitude: 48.85,
      longitude: 2.35,
      timezoneOffset: +1,
    };

    const res = await request(app)
      .post("/api/chart/generate-complete")
      .send(fullPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Chart generated successfully",
      data: {
        success: true,
        chartUrl: "https://supabase.storage/charts/user123.svg",
        planets: { Sun: "Aries" },
        ascendant: { sign: "Leo" },
      },
    });
    expect(generateCompleteChart).toHaveBeenCalledWith(fullPayload);
  });

  it("POST /api/chart/generate-complete → 500 on service failure", async () => {
    (generateCompleteChart as jest.Mock).mockRejectedValueOnce(
      new Error("explode")
    );

    const res = await request(app).post("/api/chart/generate-complete").send({
      id: "user123",
      dateOfBirth: "1999-12-31",
      timeOfBirth: "23:59",
      latitude: 48.85,
      longitude: 2.35,
      timezoneOffset: +1,
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Failed to generate complete chart");
  });
});
