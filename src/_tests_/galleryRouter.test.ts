import { MongoClient } from "mongodb";
import server, { dbUri } from "../server.js";
import request from "supertest";
import { mockUser, mockImage, uploadImageAndGetCookies } from "./testUtils.js";

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

  test("POST /api/auth/gallery, unauthenticated users can not upload images to the gallery", async () => {
    const response = await request(server)
      .post("/api/auth/gallery")
      .send(mockImage);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Not authenticated");
  });

  test("POST /api/auth/gallery, authenticated users can upload images to the gallery", async () => {
    const { postResponse } = await uploadImageAndGetCookies(
      server,
      mockImage
      //Helper funtion that sets a cookie after log in and upload an image
    );

    expect(postResponse.status).toBe(201);
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

    expect(response.status).toBe(200);
    expect(response.body[0].user_information).toMatchObject({
      first_name: "test",
      last_name: "example",
    });
  });

  test("GET, /api/auth/gallery, return an image with id", async () => {
    const { postResponse } = await uploadImageAndGetCookies(server, mockImage);
    const imageById = await request(server).get(
      `/api/auth/gallery/${postResponse.body._id}`
    );
    expect(imageById.status).toBe(200);
    expect(imageById.body).toMatchObject({
      _id: imageById.body._id,
      user_id: imageById.body.user_id,
      category: "Nails",
      url: "test",
      title: "title",
      upload_date: imageById.body.upload_date,
      tags: ["test"],
    });
  });

  test("DELETE, /api/auth/gallery, removes an image from the gallery", async () => {
    const { postResponse } = await uploadImageAndGetCookies(server, mockImage);
    const deleteReq = await request(server).delete(
      `/api/auth/gallery/${postResponse.body._id}`
    );
    expect(deleteReq.status).toBe(200);
    expect(deleteReq.body).toEqual({
      acknowledged: true,
      deletedCount: 1,
    });
  });
});
