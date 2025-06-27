import request from "supertest";
import express from "express";

// 1. Mock of the Supabase module
const deleteUserMock = jest.fn();

jest.mock("@supabase/supabase-js", () => {
  return {
    createClient: () => ({
      auth: {
        admin: {
          deleteUser: deleteUserMock,
        },
      },
    }),
  };
});

// 2. Import the route AFTER the mock
import deleteAccountRoutes from "../src/routes/deleteRoutes";

const app = express();
app.use(express.json());
app.use("/api", deleteAccountRoutes);

describe("POST /api/delete-account", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if userId is missing", async () => {
    const res = await request(app).post("/api/delete-account").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Missing userId" });
    expect(deleteUserMock).not.toHaveBeenCalled();
  });

  it("successfully deletes user", async () => {
    deleteUserMock.mockResolvedValueOnce({ error: null });

    const res = await request(app)
      .post("/api/delete-account")
      .send({ userId: "user_123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(deleteUserMock).toHaveBeenCalledWith("user_123");
  });

  it("handles deletion error from Supabase", async () => {
    deleteUserMock.mockResolvedValueOnce({
      error: { message: "Could not delete user" },
    });

    const res = await request(app)
      .post("/api/delete-account")
      .send({ userId: "user_456" });

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Could not delete user" });
    expect(deleteUserMock).toHaveBeenCalledWith("user_456");
  });
});
