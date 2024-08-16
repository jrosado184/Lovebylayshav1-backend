import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import server, { dbUri } from "../server";
import request from "supertest";
import { mockUser, guestMockUser } from "./testUtils";

dotenv.config();

describe("Test user auth endpoints", () => {
  let db: any;
  let client: any;

  beforeAll(async () => {
    client = await MongoClient.connect(dbUri, {
      maxPoolSize: 10,
    });
    db = client.db("testing");
  });

  beforeEach(async () => {
    await db.collection("guest_users").deleteMany({});
    await db.collection("registered_users").deleteMany({});
    await db.collection("appointments").deleteMany({});
    await db.collection("sessions").deleteMany({});
  }, 20000);

  afterAll(async () => {
    await db.collection("guest_users").deleteMany({});
    await db.collection("registered_users").deleteMany({});
    await db.collection("appointments").deleteMany({});
    await db.collection("sessions").deleteMany({});
    await client.close(true);
  });

  test("sanity", () => {});

  test("GET, /api/auth/registeredUsers, success", async () => {
    await request(server).post("/api/auth/registeredUsers").send(mockUser);

    const response = await request(server).get("/api/auth/registeredUsers");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).toMatchObject([
      {
        first_name: "test",
        last_name: "example",
        email: "email",
        phone_number: 123456789,
        appointments: {
          upcoming: [],
          past: [],
        },
        administrative_rights: false,
      },
    ]);
    expect(response.body.password).not.toBe(mockUser.password);
  }, 20000);

  test("GET, /api/auth/registeredUsers/:id, success", async () => {
    const user = await db.collection("registered_users").insertOne(mockUser);

    const userId = user.insertedId.toString();

    const response = await request(server).get(
      `/api/auth/registeredUsers/${userId}`
    );
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      administrative_rights: false,
      email: "email",
      first_name: "test",
      last_name: "example",
      phone_number: 123456789,
    });
  }, 20000);

  test("GET, /api/auth/registeredUsers/:id, non-existing-id", async () => {
    const userId = "non-existing-id";

    const response = await request(server).get(
      `/api/auth/registeredUsers/${userId}`
    );
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      `The user with id ${userId} does not exist`
    );
  }, 20000);

  test("POST, /api/auth/registeredUsers, success (includes existing guest user)", async () => {
    const guestUserRequest = await request(server)
      .post("/api/auth/guestUsers")
      .send(guestMockUser);

    const guestUser = await db.collection("guest_users").find().toArray();

    expect(guestUserRequest.status).toBe(201);

    expect(guestUserRequest.body).toMatchObject({
      first_name: "testFirst",
      last_name: "testLast",
      email: "email",
      phone_number: 123456789,
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
      .findOne({ _id: new ObjectId(guestUser[0]._id) });

    expect(guest).toBe(null);

    const appointmentId = await db.collection("appointments").find().toArray();

    expect(String(appointmentId[0].user_id)).toBe(
      registeredUserResponse.body._id
    );
  }, 20000);

  test("POST, /api/auth/registeredUsers, does not allow duplicate users", async () => {
    await request(server).post("/api/auth/registeredUsers").send(mockUser);
    const response = await request(server)
      .post("/api/auth/registeredUsers")
      .send(mockUser);
    expect(response.status).toBe(409);
    expect(response.body).toStrictEqual({
      message: "a user with that email already exists",
    });
  });

  test("PUT, /api/auth/regsteredUsers/:id, success", async () => {
    const user = await db.collection("registered_users").insertOne(mockUser);

    const userId = user.insertedId.toString();

    const updateMockUser = {
      first_name: "test1",
      last_name: "example1",
      email: "email1",
    };

    const response = await request(server)
      .put(`/api/auth/registeredUsers/${userId}`)
      .send(updateMockUser);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      first_name: "test1",
      last_name: "example1",
      email: "email1",
    });
  }, 20000);

  test("PUT, /api/auth/registeredUsers/:id, fails if not body request", async () => {
    const user = await db.collection("registered_users").insertOne(mockUser);

    const userId = user.insertedId.toString();

    const response = await request(server)
      .put(`/api/auth/registeredUsers/${userId}`)
      .send(undefined);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please enter a field to update");
  }, 20000);

  test("PUT, /api/auth/regsteredUsers/:id, non-existing-id", async () => {
    const userId = "non-existing-id";

    const response = await request(server)
      .put(`/api/auth/registeredUsers/${userId}`)
      .send(undefined);

    expect(response.status).toBe(404);
  }, 20000);

  test("DELETE, /api/auth/registeredUsers/:id, success", async () => {
    const addedUser = await request(server)
      .post("/api/auth/registeredUsers")
      .send(mockUser);
    await request(server).post("/login").send({
      email: mockUser.email,
      password: mockUser.password,
    });

    await request(server).delete(
      `/api/auth/registeredUsers/${addedUser.body._id}`
    );

    const usersSession = await db.collection("sessions").findOne({
      "session.passport.user": addedUser.body._id,
    });

    const deletedUser = await db.collection("registered_users").findOne({
      _id: addedUser.body._id,
    });

    expect(usersSession).toBeFalsy();
    expect(deletedUser).toBeNull();
  }, 20000);

  test("DELETE, /api/auth/registeredUsers/:id, fails if an appointment still exists", async () => {
    await request(server).post("/api/auth/guestUsers").send(guestMockUser);
    const registeredUer = await request(server)
      .post("/api/auth/registeredUsers")
      .send(mockUser);

    const response = await request(server).delete(
      `/api/auth/registeredUsers/${registeredUer.body._id}`
    );

    expect(response.status).toBe(409);
    expect(response.body).toStrictEqual({
      message: "Cannot delete account with upcoming appointment",
    });
  }, 20000);
});
