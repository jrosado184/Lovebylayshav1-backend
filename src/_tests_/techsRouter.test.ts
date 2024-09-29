import { MongoClient } from "mongodb";
import request from "supertest";
import server, { dbUri } from "../server";

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
  await db.collection("techs").deleteMany({});
});
afterAll(async () => {
  jest.resetModules();
  await db.collection("guest_users").deleteMany({});
  await db.collection("appointments").deleteMany({});
  await db.collection("registered_users").deleteMany({});
  await db.collection("sessions").deleteMany({});
  await db.collection("techs").deleteMany({});
});

const newTechTest = {
  tech_name: "test",
  tech_email: "test@example.com",
  tech_phone_number: "123456789",
  tech_avatar: "",
  tech_profession: "hair",
  tech_appointments: [],
};
const newTechTest1 = [
  {
    tech_name: "test1",
    tech_email: "test1@example.com",
    tech_phone_number: "1234567890",
    tech_avatar: "",
    tech_profession: "hair",
    tech_appointments: [],
  },
];

describe("Tests techs router", () => {
  test("GET, /api/techs", async () => {
    await request(server).post("/api/techs").send(newTechTest);
    await request(server).post("/api/techs").send(newTechTest1);
    const allTechs = await request(server).get("/api/techs");
    expect(allTechs.body).toHaveLength(2);
  }, 10000);

  test("POST, /api/techs", async () => {
    const addNewTech = await request(server)
      .post("/api/techs")
      .send(newTechTest);
    expect(addNewTech.body).toStrictEqual({
      _id: addNewTech.body._id,
      tech_name: "test",
      tech_email: "test@example.com",
      tech_phone_number: "123456789",
      tech_avatar: "",
      tech_profession: "hair",
      tech_appointments: [],
    });
  }, 10000);

  test("POST, /api/techs, throws error if tech already exists", async () => {
    {
      await request(server).post("/api/techs").send(newTechTest);
      const response = await request(server)
        .post("/api/techs")
        .send(newTechTest);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
        "a tech with that email or phone number already exists"
      );
    }
  }, 10000);
});
