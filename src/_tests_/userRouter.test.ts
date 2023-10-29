import dotenv from "dotenv";
import { MongoClient, Collection, ObjectId } from "mongodb";
import server, { dbUri } from "../server";
import request from "supertest";
import bcrypt from "bcrypt";

dotenv.config();

describe("Test user auth endpoints", () => {
  let db: any;
  let client: any;

  beforeAll(async () => {
    client = await MongoClient.connect(dbUri, {});
    db = client.db("testing");
  });

  beforeEach(async () => {
    jest.resetModules();
    // await db.collection("guest_users").deleteMany({});
    // await db.collection("registered_users").deleteMany({});
    // await db.collection("appointments").deleteMany({});
  });

  afterAll(async () => {
    await db.collection("guest_users").deleteMany({});
    await db.collection("registered_users").deleteMany({});
    await db.collection("appointments").deleteMany({});
    await client.close();
  });

  const guestMockUser = {
    first_name: "testFirst",
    last_name: "testLast",
    email: "email",
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
  // test("GET, /api/auth/registeredUsers, success", async () => {
  //   await request(server).post("/api/auth/registeredUsers").send(mockUser);

  //   const response = await request(server).get("/api/auth/registeredUsers");

  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveLength(1);
  //   expect(response.body).toMatchObject([
  //     {
  //       first_name: "test",
  //       last_name: "example",
  //       email: "email",
  //       phone_number: 123456789,
  //       appointments: {
  //         upcoming: [],
  //         past: [],
  //       },
  //       administrative_rights: false,
  //     },
  //   ]);
  //   expect(response.body.password).not.toBe(mockUser.password);
  // });

  // test("GET, /api/auth/registeredUsers/:id, success", async () => {
  //   const user = await db.collection("registered_users").insertOne(mockUser);

  //   const userId = user.insertedId.toString();

  //   const response = await request(server).get(
  //     `/api/auth/registeredUsers/${userId}`
  //   );
  //   expect(response.status).toBe(200);
  //   expect(response.body).toMatchObject({
  //     administrative_rights: false,
  //     email: "email",
  //     first_name: "test",
  //     last_name: "example",
  //     phone_number: 123456789,
  //   });
  // });
  // test("GET, /api/auth/registeredUsers/:id, non-existing-id", async () => {
  //   const userId = "non-existing-id";

  //   const response = await request(server).get(
  //     `/api/auth/registeredUsers/${userId}`
  //   );
  //   expect(response.status).toBe(404);
  //   expect(response.body.message).toBe(
  //     `The user with id ${userId} does not exist`
  //   );
  // });

  test("POST, /api/auth/registeredUsers, success (includes existing guest user)", async () => {
    const guestUserResponse = await request(server)
      .post("/api/auth/guestUsers")
      .send(guestMockUser);

    expect(guestUserResponse.status).toBe(201);

    expect(guestUserResponse.body.guestUser).toMatchObject({
      first_name: "testFirst",
      last_name: "testLast",
      email: "email",
      phone_number: 123456789,
    });
    expect(guestUserResponse.body.guestUserAppointment).toMatchObject({
      year: 2023,
      month: 9,
      day: 29,
      time: "9:00 PM",
    });

    const registeredUserResponse = await request(server)
      .post("/api/auth/registeredUsers")
      .send(mockUser);

    expect(registeredUserResponse.status).toBe(201);

    expect(registeredUserResponse.body.appointments.upcoming).toHaveLength(1);

    const guest = await db
      .collection("guest_users")
      .findOne({ _id: new ObjectId(guestUserResponse.body.guestUser._id) });

    expect(guest).toBe(null);

    const appointmentId = await db.collection("appointments").find().toArray()

    expect(String(appointmentId[0].user_id)).toBe(registeredUserResponse.body._id)
  });

  // test("PUT, /api/auth/regsteredUsers/:id, success", async () => {
  //   const user = await db.collection("registered_users").insertOne(mockUser);

  //   const userId = user.insertedId.toString();

  //   const updateMockUser = {
  //     first_name: "test1",
  //     last_name: "example1",
  //     email: "email1",
  //   };

  //   const response = await request(server)
  //     .put(`/api/auth/registeredUsers/${userId}`)
  //     .send(updateMockUser);
  //   expect(response.status).toBe(200);
  //   expect(response.body).toMatchObject({
  //     first_name: "test1",
  //     last_name: "example1",
  //     email: "email1",
  //   });
  // });

  // test("PUT, /api/auth/registeredUsers/:id, fails if not body request", async () => {
  //   const user = await db.collection("registered_users").insertOne(mockUser);

  //   const userId = user.insertedId.toString();

  //   const response = await request(server)
  //     .put(`/api/auth/registeredUsers/${userId}`)
  //     .send(undefined);

  //   expect(response.status).toBe(400);
  //   expect(response.body.message).toBe("Please enter a field to update");
  // });

  // test("PUT, /api/auth/regsteredUsers/:id, non-existing-id", async () => {
  //   const userId = "non-existing-id";

  //   const response = await request(server)
  //     .put(`/api/auth/registeredUsers/${userId}`)
  //     .send(undefined);

  //   expect(response.status).toBe(404);
  // });
});
