import dotenv from "dotenv";
import { MongoClient, Collection, ObjectId } from "mongodb";
import server, { dbUri } from "../server";
import request from "supertest";

dotenv.config();

describe("Test guest user endpoints", () => {
  let db: Collection<any>;
  let client: any;

  beforeAll(async () => {
    client = await MongoClient.connect(dbUri, {});
    db = client.db("testing").collection("guest_users");
  });

  beforeEach(async () => {
    jest.resetModules();
    await db.deleteMany({});
  });

  afterAll(async () => {
    await db.deleteMany({});
    await client.close();
  });

  const mockUser = {
    first_name: "testFirst",
    last_name: "testLast",
    email: "test@example.com",
    phone_number: 123456789,
      year: 2023,
      month: 9,
      day: 29,
      time: "9:00 PM",
      services: {
        nails: {
          fullSet: true,
          refill: false,
          shape: "coffin",
          length: "Shorties",
          designs: "Full Frenchies",
          extras: ["Soak Off"],
        },
        pedicure: null,
        addons: null,
    },
  };

  test("GET /api/auth/guestUsers", async () => {
    await db.insertOne(mockUser);

    const response = await request(server).get("/api/auth/guestUsers");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("GET /api/auth/guestUsers/:id, success", async () => {
    const addUser = await db.insertOne(mockUser);

    const userId = addUser.insertedId.toString();

    const response = await request(server).get(
      `/api/auth/guestUsers/${userId}`
    );

    expect(response.status).toBe(200);
  });

  test("GET, /api/auth/guestUsers/:id, non-existing-id", async () => {
    const userId = "non-existing-id";

    const response = await request(server).get(`/api/auth/guestUsers/${userId}`);

    expect(response.status).toBe(404);
  });

  test("POST, /api/auth/guestUsers, success", async () => {
    const response = await request(server)
      .post("/api/auth/guestUsers")
      .send(mockUser);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({first_name: "testFirst"})
    expect(response.body).not.toMatchObject({  year: 2023,
      month: 9,
      day: 29,
      time: "9:00 PM",
      services: {
        nails: {
          fullSet: true,
          refill: false,
          shape: "coffin",
          length: "Shorties",
          designs: "Full Frenchies",
          extras: ["Soak Off"],
        },
        pedicure: null,
        addons: null,
    },})
  });

  test("POST, /api/auth/guestUsers, invalid-body", async () => {
    const response = await request(server)
      .post("/api/auth/guestUsers")
      .send({appointment: {year: 2023, month: 5, day: 11}});
    expect(response.status).toBe(400);
  });
});
