import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import server, { dbUri } from "../server.js";
import request from "supertest";

dotenv.config();

describe("Test guest user endpoints", () => {
  let db: any;
  let client: any;

  test("sanity", () => {});

  beforeAll(async () => {
    client = await MongoClient.connect(dbUri, {});
    db = client.db("testing");
  });

  beforeEach(async () => {
    jest.resetModules();
    await db.collection("guest_users").deleteMany({});
    await db.collection("appointments").deleteMany({});
    await db.collection("registered_users").deleteMany({});
    await db.collection("sessions").deleteMany({});
  });

  afterAll(async () => {
    await db.collection("guest_users").deleteMany({});
    await db.collection("appointments").deleteMany({});
    await db.collection("registered_users").deleteMany({});
    await db.collection("sessions").deleteMany({});
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
  const mockUser1 = {
    first_name: "testFirst",
    last_name: "testLast",
    email: "test@example.com",
    phone_number: 123456789,
    year: 2023,
    month: 9,
    day: 29,
    time: "10:00 PM",
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
  const mockUser2 = {
    first_name: "testFirst1",
    last_name: "testLast1",
    email: "test1@example.com",
    phone_number: 1234567890,
    year: 2023,
    month: 10,
    day: 29,
    time: "10:00 PM",
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

  const mockAppointment = {
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
    await db.collection("guest_users").insertOne(mockUser);

    const response = await request(server).get("/api/auth/guestUsers");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  }, 20000);

  test("GET /api/auth/guestUsers/:id, success", async () => {
    const addUser = await db.collection("guest_users").insertOne(mockUser);

    const userId = addUser.insertedId.toString();

    const response = await request(server).get(
      `/api/auth/guestUsers/${userId}`
    );

    expect(response.status).toBe(200);
  }, 20000);

  test("GET, /api/auth/guestUsers/:id, non-existing-id", async () => {
    const userId = new ObjectId("7a2f0be9c82b");

    const response = await request(server).get(
      `/api/auth/guestUsers/${userId}`
    );

    expect(response.status).toBe(404);
  }, 20000);

  test("POST, /api/auth/guestUsers, success", async () => {
    const response = await request(server)
      .post("/api/auth/guestUsers")
      .send(mockUser);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      guestUser: { first_name: "testFirst" },
    });
    expect(response.body).toMatchObject({
      guestUserAppointment: { year: 2023 },
    });
    expect(response.body.guestUser._id).toEqual(
      response.body.guestUserAppointment.user_id
    );
    expect(response.body.guestUser.appointment_id[0]).toEqual(
      response.body.guestUserAppointment._id
    );
  }, 20000);

  test("POST, /api/auth.guestUsers, appointments belonging to one user are added to users appointment_id", async () => {
    await request(server).post("/api/auth/guestUsers").send(mockUser);
    await request(server).post("/api/auth/guestUsers").send(mockUser1);

    const getGuestUser = await db.collection("guest_users").find().toArray();

    expect(getGuestUser[0].appointment_id).toHaveLength(2);

    const getAppointments = await db
      .collection("appointments")
      .find()
      .toArray();
    expect(getAppointments).toHaveLength(2);
    expect(getAppointments[0].user_id).toEqual(getAppointments[1].user_id);
  }, 20000);

  test("POST, /api/auth/guestUsers, appointments belonging to separate users are handled individually", async () => {
    await request(server).post("/api/auth/guestUsers").send(mockUser);
    await request(server).post("/api/auth/guestUsers").send(mockUser2);

    const getGuestUsers = await db.collection("guest_users").find().toArray();

    expect(getGuestUsers).toHaveLength(2);
    expect(getGuestUsers[0].appointment_id).toHaveLength(1);
    expect(getGuestUsers[1].appointment_id).toHaveLength(1);

    const getAppointments = await db
      .collection("appointments")
      .find()
      .toArray();

    expect(getAppointments).toHaveLength(2);
    expect(getAppointments[0].user_id).not.toEqual(getAppointments[1].user_id);
  }, 20000);

  test("POST, /api/auth/guestUsers, invalid-body", async () => {
    const response = await request(server)
      .post("/api/auth/guestUsers")
      .send({ appointment: { year: 2023, month: 5, day: 11 } });
    expect(response.status).toBe(400);
  }, 20000);

  test("POST, /api/auth/guestUsers, does not create duplicate guest user", async () => {
    await request(server).post("/api/auth/guestUsers").send(mockUser);
    const response = await request(server)
      .post("/api/auth/guestUsers")
      .send(mockUser1);

    expect(response.status).toBe(201);

    const guestUsers = await db.collection("guest_users").find().toArray();
    expect(guestUsers).toHaveLength(1);
  }, 20000);

  test("POST, /api/auth/guestUsers, does not allow duplicate appointments", async () => {
    await request(server).post("/api/auth/guestUsers").send(mockUser);
    const response = await request(server)
      .post("/api/auth/guestUsers")
      .send(mockUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "This appointment has already been booked",
    });
  }, 20000);

  test("PUT, /api/auth/guestUsers, success", async () => {
    const guestUserId = await request(server)
      .post("/api/auth/guestUsers")
      .send(mockUser);
    const response = await request(server)
      .put(`/api/auth/guestUsers/${guestUserId.body.guestUser._id}`)
      .send({
        first_name: "test2",
      });
    expect(response.status).toBe(200);
    expect(response.body.first_name).toBe("test2");
  },20000);

  test("PUT, /api/auth/guestUsers, fails if email already exists", async () => {
    const guestUserId = await request(server)
      .post("/api/auth/guestUsers")
      .send(mockUser);
    const response = await request(server)
      .put(`/api/auth/guestUsers/${guestUserId.body.guestUser._id}`)
      .send({
        email: "test@example.com",
      });
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Cannot use existing email",
    });
  },20000);

  test("DELETE, /api/auth/guestUsers/:id", async () => {
    const guestUserId = await request(server)
      .post("/api/auth/guestUsers")
      .send(mockUser);


    const response = await request(server).delete(
      `/api/auth/guestUsers/${guestUserId.body.guestUser._id}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
    "Guest user successfully deleted",
    );
  },20000);
});
