import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import server, { dbUri } from "../server";
import request from "supertest";

dotenv.config();

describe("Test authentication endpoints", () => {
  let db: any;
  let client: any;

  beforeAll(async () => {
    client = await MongoClient.connect(dbUri, {});
    db = client.db("testing");
  });

  beforeEach(async () => {
    await db.collection("guest_users").deleteMany({});
    await db.collection("registered_users").deleteMany({});
    await db.collection("appointments").deleteMany({});
    await db.collection("sessions").deleteMany({});
  });

  afterAll(async () => {
    await db.collection("guest_users").deleteMany({});
    await db.collection("registered_users").deleteMany({});
    await db.collection("appointments").deleteMany({});
    await db.collection("sessions").deleteMany({});
    await client.close();
  });

  const mockUser = {
    first_name: "test",
    last_name: "example",
    email: "email",
    password: "password",
    phone_number: 123456789,
    appointments: {
      upcoming: [],
      past: [],
    },
    createdAt: "today",
    updatedAt: "today",
    administrative_rights: false,
  };

  const mockAppointment = {
    year: 2023,
    month: 11,
    day: 8,
    time: "10:00 AM",
    service: "Full Set",
    shape: "coffin",
    length: "Shorties",
    design: "any",
    extras: ["any"],
    pedicure: "false",
    inspirations: ["https://picsum.photos/200/300"],
    user_id: new ObjectId(),
  };

  test("/login", async () => {
    const user = await request(server)
      .post("/api/auth/registeredUsers")
      .send(mockUser);
    await db.collection("sessions").deleteMany({});
    const registerUser = await request(server).post("/login").send({
      email: "email",
      password: "password",
    });

    const session = await db.collection("sessions").findOne({
      "session.passport.user": user.body._id,
    });

    expect(session.session.passport.user).toBe(user.body._id);
    expect(registerUser.status).toBe(200);
    expect(registerUser.body).toMatchObject({
      first_name: "test",
      last_name: "example",
      email: "email",
    });
  });
});
