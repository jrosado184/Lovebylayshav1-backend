import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import server, { dbUri } from "../server";
import request from "supertest";

dotenv.config();

describe("Test appointments endpoints", () => {
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
    // await db.collection("registered_users").deleteMany({});
    // await db.collection("appointments").deleteMany({});
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
    services: {
      nails: {
        fullSet: true,
        refill: false,
        shape: "coffin",
        length: "Shorties",
        design: "any",
        extras: ["any"],
      },
      pedicure: "false",
      addons: "none"
    },
    user_id: new ObjectId()
  };

//   test("GET, /api/auth/appointments", async () => {
//     const response = await request(server).get("/api/auth/appointments");
//     expect(response.status).toBe(200);
//     expect(response.body).toStrictEqual([]);
//   });

  test("POST, /api/auth/appointments", async () => {
    const addNewUser = await request(server).post("/api/auth/registeredUsers").send(mockUser)

    mockAppointment.user_id = addNewUser.body._id

    const response = await request(server)
      .post("/api/auth/appointments")
      .send(mockAppointment);
    expect(response.status).toBe(201);

    const registeredUser = await db.collection("registered_users").findOne({
        _id: new ObjectId(addNewUser.body._id)
    })

    expect(registeredUser.appointments.upcoming[0]).toStrictEqual(new ObjectId(response.body._id))

  },20000);
});
