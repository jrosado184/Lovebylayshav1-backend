import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import server, { dbUri } from "../server";
import request from "supertest";
import {
  deleteDocumentById,
  findOneDocumentById,
  insertIntoDatabase,
} from "../database/globalFunctions";

dotenv.config();

describe("Test appointments endpoints", () => {
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
    // await db.collection("guest_users").deleteMany({});
    await db.collection("registered_users").deleteMany({});
    // await db.collection("appointments").deleteMany({});
    await db.collection("sessions").deleteMany({});
    await client.close(true);
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
    user_id: new ObjectId(),
  };

  const mockGuestUser = {
    first_name: "testFirst",
    last_name: "testLast",
    email: "test@example.com",
    phone_number: 123456789,
    year: 2023,
    month: 9,
    day: 29,
    time: "9:00 PM",
    service: "Full Set",
    shape: "coffin",
    length: "Shorties",
    design: "Full Frenchies",
    extras: ["Soak Off"],
    pedicure: "none",
    inspirations: [],
  };
  const mockGuestUser1 = {
    first_name: "testFirst",
    last_name: "testLast",
    email: "test@example.com",
    phone_number: 123456789,
    year: 2023,
    month: 10,
    day: 29,
    time: "9:00 PM",
    service: "Full Set",
    shape: "coffin",
    length: "Shorties",
    design: "Full Frenchies",
    extras: ["Soak Off"],
    pedicure: "none",
    inspirations: [],
  };

  test("GET, /api/auth/appointments", async () => {
    const response = await request(server).get("/api/auth/appointments");
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  test("POST, /api/auth/appointments", async () => {
    const addNewUser = await request(server)
      .post("/api/auth/registeredUsers")
      .send(mockUser);

    mockAppointment.user_id = addNewUser.body._id;

    const response = await request(server)
      .post("/api/auth/appointments")
      .send(mockAppointment);
    expect(response.status).toBe(201);

    const registeredUser = await db.collection("registered_users").findOne({
      _id: new ObjectId(addNewUser.body._id),
    });

    expect(registeredUser.appointments.upcoming[0]).toStrictEqual(
      new ObjectId(response.body._id)
    );
  }, 20000);

  test("PUT, /api/auth/appointments/:id, success", async () => {
    const user = await request(server)
      .post("/api/auth/registeredUsers")
      .send(mockUser);

    mockAppointment.user_id = user.body._id;

    const appointment = await request(server)
      .post("/api/auth/appointments")
      .send(mockAppointment);

    const response = await request(server)
      .put(`/api/auth/appointments/${new ObjectId(appointment.body._id)}`)
      .send({
        day: 9,
        month: 11,
        year: 2023,
      });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      day: 9,
      month: 11,
      year: 2023,
    });
  }, 20000);

  test("DELETE, /api/auth/appointments/:id, registered users", async () => {
    const user = await request(server)
      .post("/api/auth/registeredUsers")
      .send(mockUser);

    mockAppointment.user_id = user.body._id;

    const appointment = await request(server)
      .post("/api/auth/appointments")
      .send(mockAppointment);

    const response = await request(server).delete(
      `/api/auth/appointments/${new ObjectId(appointment.body._id)}`
    );
    const getAppointment = await db.collection("appointments").findOne({
      _id: new ObjectId(response.body._id),
    });

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      message: "appointment successfully deleted",
    });
    expect(getAppointment).toBe(null);
  }, 20000);

  test("DELETE, /api/auth/appointments/:id, guest users", async () => {
    
    await request(server).post("/api/auth/guestUsers").send(mockGuestUser);

    const user = await db.collection("guest_users").find({}).toArray();

    const response = await request(server).delete(
      `/api/auth/appointments/${new ObjectId(user?.[0].appointment_id?.[0])}`
    )

     const checkIfGuestUserWasDeleted = await db.collection("guest_users").findOne({
      _id: new ObjectId(user?.[0]._id),
     })

    expect(response.status).toBe(200);
    expect(checkIfGuestUserWasDeleted).toBe(null)
  }, 20000);


  test("DELETE, /api/auth/appointments/:id, guest users is not removed if more than one appointment exits", async () => {
    
   await request(server).post("/api/auth/guestUsers").send(mockGuestUser);
   await request(server).post("/api/auth/guestUsers").send(mockGuestUser1);


    const user = await db.collection("guest_users").find({}).toArray();

    const response = await request(server).delete(
      `/api/auth/appointments/${new ObjectId(user?.[0].appointment_id?.[0])}`
    )

     const checkIfGuestUserWasDeleted = await db.collection("guest_users").findOne({
      _id: new ObjectId(user?.[0]._id),
     })

    expect(response.status).toBe(200);
    expect(checkIfGuestUserWasDeleted).not.toBe(null)
  }, 20000);
});
