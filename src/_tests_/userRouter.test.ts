import dotenv from "dotenv";
import { Db, MongoClient, Collection } from "mongodb";
import server from "../server";
import  request from "supertest";

dotenv.config();

const test_db_url = process.env.MONGO_DATABASE_URL ?? "";

describe("Test user auth endpoints", () => {
    let db: Collection<any>;

  beforeAll(async () => {
    const client = (await MongoClient.connect(test_db_url, {})).db("testing")
    db = client.collection("registered_users")
  });

  afterAll(async () => {
    await db.deleteMany({});
  });

  beforeEach(async () => {
    await db.deleteMany({});
  });

  test("PUT, /api/auth/regsteredUsers/:id", async () => {

   const insertUser =  await db.insertOne({
        _id: "651f4329338f9653c4f66011",
        connection: "lovebylaysha",
        client_id: "8GQ4NCt1lVYjQneh1iKnOxgqmMQgiPKP",
        email: "javierrosado184@gmail.com"
    })
    const userId = insertUser.insertedId.toString()

    const mockUser = {
    first_name: "testFirst",
    last_name: "testLast",
    phone_number: 12345678,
    appointments: {
      upcoming: [],
      past: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
}
const response = await request(server).put(`/api/auth/registeredUsers/${userId}`).send(mockUser)
  });

});
