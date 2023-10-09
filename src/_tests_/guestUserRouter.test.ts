import dotenv from "dotenv";
import { MongoClient, Collection, ObjectId } from "mongodb";
import server, { dbUri } from "../server";
import request from "supertest";

dotenv.config();

describe("Test guest user endpoints", () => {
  let db: Collection<any>;
  let client: any;

  beforeAll(async () => {
    client = await MongoClient.connect(dbUri, {});
    db = client.db("testing").collection("guest_users");
  });

  beforeEach(async () => {
    jest.resetModules();
    await db.deleteMany({});
  });

  afterAll(async () => {
    await db.deleteMany({});
    await client.close();
  });
  test("GET /api/auth/guestUsers", async () => {
    const users = [
      {
        first_name: "testFirst",
        last_name: "testLast",
        email: "test@example.com",
        phone_number: 123456789,
        appointment: {
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
        },
      },
    ];
  
    await db.insertMany(users)

    const response = await request(server).get("/api/auth/guestUsers")

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(1)
  });
});

