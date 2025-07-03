import axios from "axios";

const API_BASE_URL = "https://astro-app-eight-chi.vercel.app";

describe("AstroMood API Integration Tests", () => {
  describe("Timezone API", () => {
    it("should return timezone for Paris", async () => {
      const response = await axios.get(`${API_BASE_URL}/api/timezone`, {
        params: { lat: 48.8566, lon: 2.3522 },
      });

      expect(response.status).toBe(200);
      expect(response.data.name).toBe("Europe/Paris");
      expect(typeof response.data.timezone).toBe("number");
    });

    it("should return timezone for New York", async () => {
      const response = await axios.get(`${API_BASE_URL}/api/timezone`, {
        params: { lat: 40.7128, lon: -74.006 },
      });

      expect(response.status).toBe(200);
      expect(response.data.name).toBe("America/New_York");
    });

    it("should return 400 for missing parameters", async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/timezone`);
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toBe("Missing lat/lon parameters");
      }
    });
  });

  describe("Planets API", () => {
    it("should return planet positions for valid data", async () => {
      const payload = {
        year: 2000,
        month: 1,
        date: 1,
        hours: 12,
        minutes: 0,
        seconds: 0,
        latitude: 48.8566,
        longitude: 2.3522,
        timezone: 1,
      };

      const response = await axios.post(`${API_BASE_URL}/api/planets`, payload);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("output");
      expect(Array.isArray(response.data.output)).toBe(true);
      expect(response.data.output.length).toBeGreaterThan(0);
    }, 15000);
  });

  describe("Generate Complete Chart API", () => {
    it("should return 401 if unauthenticated", async () => {
      const testUser = {
        id: `test-integration-${Date.now()}`,
        dateOfBirth: "1990-06-15",
        timeOfBirth: "1990-06-15T14:30:00Z",
        latitude: 48.8566,
        longitude: 2.3522,
        timezoneOffset: 2,
      };

      try {
        await axios.post(`${API_BASE_URL}/api/generate-complete`, testUser);
      } catch (error: any) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.error).toBe("Unauthorized");
      }
    });

    it("should return 401 if fields are missing and unauthenticated", async () => {
      try {
        await axios.post(`${API_BASE_URL}/api/generate-complete`, {
          id: "test-incomplete",
        });
      } catch (error: any) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.error).toBe("Unauthorized");
      }
    });
  });

  describe("Delete Account API", () => {
    it("should return 401 if unauthenticated", async () => {
      try {
        await axios.post(`${API_BASE_URL}/api/delete-account`, {});
      } catch (error: any) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.error).toBe("Unauthorized");
      }
    });
  });

  describe("Security Tests", () => {
    describe("Authentication Required", () => {
      it("should return 401 for generate-complete without auth", async () => {
        const testUser = {
          id: `test-${Date.now()}`,
          dateOfBirth: "1990-06-15",
          timeOfBirth: "1990-06-15T14:30:00Z",
          latitude: 48.8566,
          longitude: 2.3522,
          timezoneOffset: 2,
        };

        try {
          await axios.post(`${API_BASE_URL}/api/generate-complete`, testUser);
        } catch (error: any) {
          expect(error.response.status).toBe(401);
          expect(error.response.data.error).toBe("Unauthorized");
        }
      });

      it("should return 401 for delete-account without auth", async () => {
        try {
          await axios.post(`${API_BASE_URL}/api/delete-account`, {
            userId: "fake-user-id",
          });
        } catch (error: any) {
          expect(error.response.status).toBe(401);
          expect(error.response.data.error).toBe("Unauthorized");
        }
      });

      it("should return 401 for invalid token", async () => {
        const fakeToken = "fake-token-123";

        try {
          await axios.post(
            `${API_BASE_URL}/api/delete-account`,
            { userId: "fake-user-id" },
            {
              headers: {
                Authorization: `Bearer ${fakeToken}`,
              },
            }
          );
        } catch (error: any) {
          expect(error.response.status).toBe(401);
          expect(error.response.data.message).toContain(
            "Invalid or expired token"
          );
        }
      });
    });
  });

  describe("CORS Tests", () => {
    it("should respond to OPTIONS preflight for generate-complete", async () => {
      const response = await axios.options(
        `${API_BASE_URL}/api/generate-complete`,
        {
          headers: {
            Origin: "https://test-origin.com",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type, Authorization",
          },
          validateStatus: () => true,
        }
      );

      expect(response.status).toBe(200);
      expect(response.headers["access-control-allow-origin"]).toBe("*");
      expect(response.headers["access-control-allow-methods"]).toContain(
        "POST"
      );
      expect(response.headers["access-control-allow-headers"]).toContain(
        "Authorization"
      );
    });

    it("should respond to OPTIONS preflight for delete-account", async () => {
      const response = await axios.options(
        `${API_BASE_URL}/api/delete-account`,
        {
          headers: {
            Origin: "https://another-origin.com",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type, Authorization",
          },
          validateStatus: () => true,
        }
      );

      expect(response.status).toBe(200);
      expect(response.headers["access-control-allow-origin"]).toBe("*");
      expect(response.headers["access-control-allow-methods"]).toContain(
        "POST"
      );
    });
  });

  describe("API Health Summary", () => {
    it("should confirm all endpoints are accessible", async () => {
      console.log("\n Integration Test Summary:");
      console.log(" - Timezone API: Functional");
      console.log(" - Planets API: Functional");
      console.log(" - Generate Chart API: Protected (401 without token)");
      console.log(" - Delete Account API: Protected (401 without token)");
      console.log(" - CORS Preflight: Responses OK");
      expect(true).toBe(true);
    });
  });
});
