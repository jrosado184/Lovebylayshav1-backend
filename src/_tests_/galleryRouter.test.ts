import { MongoClient } from "mongodb";
import server, { dbUri } from "../server.js";
import request from "supertest";
import { mockUser } from "./testUtils.js";

describe("Test Gallery Endpoints", () => {
  let db: any;
  let client: MongoClient;

  beforeAll(async () => {
    client = await MongoClient.connect(dbUri, {
      maxPoolSize: 10,
    });
    db = client.db("testing");
  });

  beforeEach(async () => {
    jest.resetModules();
    await db.collection("guest_users").deleteMany({});
    await db.collection("appointments").deleteMany({});
    await db.collection("registered_users").deleteMany({});
    await db.collection("sessions").deleteMany({});
    await db.collection("gallery").deleteMany({});
    await request(server).post("/api/auth/registeredUsers").send(mockUser);
  }, 20000);

  afterAll(async () => {
    await db.collection("guest_users").deleteMany({});
    await db.collection("appointments").deleteMany({});
    await db.collection("registered_users").deleteMany({});
    await db.collection("sessions").deleteMany({});
    await db.collection("gallery").deleteMany({});
    await client.close(true);
  });

  const mockImage = {
    _id: "66bd495ac2d874ec775b2707",
    category: "Nails",
    user_id: "",
    url: "test",
    upload_date: "Wed Aug 14 2024 20:18:34 GMT-0400 (Eastern Daylight Time)",
    tags: ["test"],
  };

  test("POST /api/auth/gallery, unauthenticated users can not upload images to the gallery", async () => {
    const response = await request(server)
      .post("/api/auth/gallery")
      .send(mockImage);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Not authenticated");
  });

  test("POST /api/auth/gallery, authenticated users can upload images to the gallery", async () => {
    const loginResponse = await request(server).post("/login").send({
      email: "email",
      password: "password",
    });

    //Extract cookies from the login response
    const cookies = loginResponse.headers["set-cookie"]; // Capture session cookies

    const response = await request(server)
      .post("/api/auth/gallery")
      .set("Cookie", cookies) // Pass the session cookies to the next request
      .send(mockImage);

    expect(response.status).toBe(201);
  });

  test("GET /api/auth/gallery, return all images with their respective user information", async () => {
    const loginResponse = await request(server).post("/login").send({
      email: "email",
      password: "password",
    });

    const cookies = loginResponse.headers["set-cookie"]; // Capture session cookies

    mockImage.user_id = loginResponse.body._id;

    await request(server)
      .post("/api/auth/gallery")
      .set("Cookie", cookies) // Pass the session cookies to the next request
      .send(mockImage);

    const response = await request(server).get("/api/auth/gallery");

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body[0].user_information).toMatchObject({
      first_name: "test",
      last_name: "example",
    });
  });
});
