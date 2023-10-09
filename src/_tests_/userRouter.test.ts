import dotenv from "dotenv";
import { MongoClient, Collection, ObjectId } from "mongodb";
import server, { dbUri } from "../server";
import request from "supertest";

dotenv.config();

describe("Test user auth endpoints", () => {
  let db: Collection<any>;
  let client: any;

  beforeAll(async () => {
    client = await MongoClient.connect(dbUri, {});
    db = client.db("testing").collection("registered_users");
  });

  beforeEach(async () => {
    jest.resetModules();
    await db.deleteMany({});
  });

  afterAll(async () => {
    await db.deleteMany({});
    await client.close();
  });

  test("GET, /api/auth/registeredUsers, success", async () => {
    const users = [
      {
        connect: "testConnection",
        email: "test@example.com",
        password: "hashedPassword",
      },
      {
        connect: "testConnection1",
        email: "test1@example.com",
        password: "hashedPassword1",
      },
    ];

    await db.insertMany(users);

    const response = await request(server).get("/api/auth/registeredUsers");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test("GET, /api/auth/registeredUsers/:id, success", async () => {
    const user = await db.insertOne({
      connect: "testConnection",
      email: "test@example.com",
      password: "hashedPassword",
    });

    const userId = user.insertedId.toString();

    const response = await request(server).get(
      `/api/auth/registeredUsers/${userId}`
    );
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      connect: "testConnection",
      email: "test@example.com",
      password: "hashedPassword",
    });
  });
  test("GET, /api/auth/registeredUsers/:id, non-existing-id", async () => {
    const user = await db.insertOne({
      connect: "testConnection",
      email: "test@example.com",
      password: "hashedPassword",
    });

    const userId = "non-existing-id";

    const response = await request(server).get(
      `/api/auth/registeredUsers/${userId}`
    );
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`The user with id ${userId} does not exist`)
  });

  test("PUT, /api/auth/regsteredUsers/:id, success", async () => {
    const user = await db.insertOne({
      connection: "testConnection",
      email: "test@example.com",
      password: "hashedPassword",
    });

    const userId = user.insertedId.toString();

    const mockUser = {
      first_name: "testFirst",
      last_name: "testLast",
      phone_number: 12345678,
      appointments: {
        upcoming: [],
        past: [],
      },
    };

    const response = await request(server)
      .put(`/api/auth/registeredUsers/${userId}`)
      .send(mockUser);

    expect(response.body.userData).toMatchObject({ first_name: "testFirst" });
  });

  test("PUT, /api/auth/registeredUsers/:id, fails if not body request", async () => {
    const user = await db.insertOne({
      connection: "testConnection",
      email: "test@example.com",
      password: "hashedPassword",
    });

    const userId = user.insertedId.toString();

    const mockUser = {
      first_name: "testFirt",
    };
    const response = await request(server)
      .put(`/api/auth/registeredUsers/${userId}`)
      .send(mockUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Please provide a first name and last name"
    );
  });

  test("PUT, /api/auth/regsteredUsers/:id, non-existing-id", async () => {
    const user = await db.insertOne({
      connection: "testConnection",
      email: "test@example.com",
      password: "hashedPassword",
    });

    const userId = "non-existing-id";

    const mockUser = {
      first_name: "testFirst",
      last_name: "testLast",
      phone_number: 12345678,
      appointments: {
        upcoming: [],
        past: [],
      },
    };

    const response = await request(server)
      .put(`/api/auth/registeredUsers/${userId}`)
      .send(mockUser);

    expect(response.status).toBe(404);
  });
});
