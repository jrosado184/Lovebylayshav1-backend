import dotenv from "dotenv";
import { MongoClient, Collection, ObjectId, Db } from "mongodb";
import server, { connect, dbUri } from "../server";
import request from "supertest";

dotenv.config();

describe("Test user auth endpoints", () => {
  let db: Collection<any>;
  let client: any;

  beforeAll(async () => {
    client = await MongoClient.connect(dbUri, {})
    db = client.db("testing").collection("registered_users");
  });
  
  beforeEach(async () => {
    jest.resetModules();
    await db.deleteMany({});
  });

  afterAll(async () => {
    await db.deleteMany({});
    await client.close()
  });


  test("PUT, /api/auth/regsteredUsers/:id", async () => {

    const user = await db.insertOne({
      connection: "testConnection",
      email: "test@example.com",
      password: "hashedPassword"
    })

    const userId = user.insertedId.toString()

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

      
    expect(response.body.userData).toMatchObject({first_name: "testFirst"})
  });
});
