import request from "supertest";

jest.mock("../db/db", () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
    connect: jest.fn(),
  },
}));

import app from "../app.js";
import pool from "../db/db.js";

const mockPool = pool as unknown as { query: jest.Mock };

describe("player routes", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  beforeEach(() => {
    mockPool.query.mockReset();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("GET / returns all players", async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          level: 5,
          brainrotId: 2,
          inventory: [1, 2],
          gold: 100,
        },
      ],
      rowCount: 1,
    });

    const response = await request(app).get("/api/v1/player/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        level: 5,
        brainrotId: 2,
        inventory: [1, 2],
        gold: 100,
      },
    ]);
    expect(mockPool.query).toHaveBeenCalledWith("SELECT * FROM player");
  });

  it("GET /:id returns a player", async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          level: 3,
          brainrotId: 4,
          inventory: [2],
          gold: 50,
        },
      ],
      rowCount: 1,
    });

    const response = await request(app).get("/api/v1/player/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      level: 3,
      brainrotId: 4,
      inventory: [2],
      gold: 50,
    });
    expect(mockPool.query).toHaveBeenCalledWith(
      "SELECT * FROM player WHERE id = $1",
      [1]
    );
  });

  it("GET /:id returns 404 when not found", async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const response = await request(app).get("/api/v1/player/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Player not found" });
  });

  it("POST / creates a player", async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          level: 1,
          brainrotId: 2,
          inventory: [],
          gold: 0,
        },
      ],
      rowCount: 1,
    });

    const response = await request(app).post("/api/v1/player/").send({
      level: 1,
      brainrotId: 2,
      inventory: [],
      gold: 0,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 1,
      level: 1,
      brainrotId: 2,
      inventory: [],
      gold: 0,
    });
    expect(mockPool.query).toHaveBeenCalledWith(
      "INSERT INTO player (level, brainrotId, inventory, gold) VALUES ($1, $2, $3, $4) RETURNING *",
      [1, 2, [], 0]
    );
  });

  it("PUT /:id updates a player", async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 2,
          level: 10,
          brainrotId: 8,
          inventory: [3],
          gold: 200,
        },
      ],
      rowCount: 1,
    });

    const response = await request(app).put("/api/v1/player/2").send({
      level: 10,
      brainrotId: 8,
      inventory: [3],
      gold: 200,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 2,
      level: 10,
      brainrotId: 8,
      inventory: [3],
      gold: 200,
    });
    expect(mockPool.query).toHaveBeenCalledWith(
      "UPDATE player SET level = $1, \"brainrotId\" = $2, inventory = $3, gold = $4 WHERE id = $5 RETURNING *",
      [10, 8, [3], 200, 2]
    );
  });

  it("PUT /:id returns 404 when not found", async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const response = await request(app).put("/api/v1/player/999").send({
      level: 10,
      brainrotId: 8,
      inventory: [3],
      gold: 200,
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Player not found" });
  });

  it("DELETE /:id deletes a player", async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });

    const response = await request(app).delete("/api/v1/player/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Player deleted successfully" });
    expect(mockPool.query).toHaveBeenCalledWith(
      "DELETE FROM player WHERE id = $1 RETURNING *",
      [1]
    );
  });

  it("DELETE /:id returns 404 when not found", async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const response = await request(app).delete("/api/v1/player/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Player not found" });
  });

  it("PATCH /:id/gold updates gold", async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 3,
          level: 1,
          brainrotId: 2,
          inventory: [],
          gold: 999,
        },
      ],
      rowCount: 1,
    });

    const response = await request(app).patch("/api/v1/player/3/gold").send({ gold: 999 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 3,
      level: 1,
      brainrotId: 2,
      inventory: [],
      gold: 999,
    });
    expect(mockPool.query).toHaveBeenCalledWith(
      "UPDATE player SET gold = $1 WHERE id = $2 RETURNING *",
      [999, 3]
    );
  });

  it("PATCH /:id/inventory adds an item", async () => {
    mockPool.query
      .mockResolvedValueOnce({ rows: [{ inventory: [1, 2] }], rowCount: 1 })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 4,
            level: 1,
            brainrotId: 2,
            inventory: [1, 2, 9],
            gold: 10,
          },
        ],
        rowCount: 1,
      });

    const response = await request(app)
      .patch("/api/v1/player/4/inventory")
      .send({ itemId: 9 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 4,
      level: 1,
      brainrotId: 2,
      inventory: [1, 2, 9],
      gold: 10,
    });
    expect(mockPool.query).toHaveBeenNthCalledWith(
      1,
      "SELECT inventory FROM player WHERE id = $1",
      [4]
    );
    expect(mockPool.query).toHaveBeenNthCalledWith(
      2,
      "UPDATE player SET inventory = $1 WHERE id = $2 RETURNING *",
      [[1, 2, 9], 4]
    );
  });

  it("GET / returns 500 on database error", async () => {
    mockPool.query.mockRejectedValueOnce(new Error("DB error"));

    const response = await request(app).get("/api/v1/player/");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "DB error" });
  });
});
