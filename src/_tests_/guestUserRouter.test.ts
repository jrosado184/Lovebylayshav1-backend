import dotenv from "dotenv";
import { MongoClient, Collection, ObjectId } from "mongodb";
import server, { dbUri } from "../server";
import request from "supertest";

dotenv.config();

describe("Test guest user endpoints", () => {
  let db: any;
  let client: any;

  beforeAll(async () => {
    client = await MongoClient.connect(dbUri, {});
    db = client.db("testing")
  });

  beforeEach(async () => {
    jest.resetModules();
    await db.collection("guest_users").deleteMany({});
    await db.collection("appointments").deleteMany({});
  });

  afterAll(async () => {
    await db.collection("guest_users").deleteMany({});
    await db.collection("appointments").deleteMany({});
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
    }
  }

  test("GET /api/auth/guestUsers", async () => {
    await db.collection("guest_users").insertOne(mockUser);

    const response = await request(server).get("/api/auth/guestUsers");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("GET /api/auth/guestUsers/:id, success", async () => {
    const addUser = await db.collection("guest_users").insertOne(mockUser);


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
    expect(response.body).toMatchObject({guestUser: {first_name: "testFirst"}})
    expect(response.body).toMatchObject({guestUserAppointment: {year: 2023}})
    expect(response.body.guestUser._id).toEqual(response.body.guestUserAppointment.user_id)
    expect(response.body.guestUser.appointment_id[0]).toEqual(response.body.guestUserAppointment._id)
  });

  test("POST, /api/auth/guestUsers, invalid-body", async () => {
    const response = await request(server)
      .post("/api/auth/guestUsers")
      .send({appointment: {year: 2023, month: 5, day: 11}});
    expect(response.status).toBe(400);
  });
});
