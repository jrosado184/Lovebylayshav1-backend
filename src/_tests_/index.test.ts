import { Db, MongoClient } from "mongodb";
import server, { options, dbUrl} from "../server";
import request from "supertest";

let db;
let client: MongoClient;

beforeAll(async () => {
  try {
    client = await MongoClient.connect(dbUrl, options);
    db = client.db();
  } catch (error) {
  }
});

afterAll(async () => {
  if (client) {
    await client.close();
  }
});

describe("Server Tests", () => {
  it("should successfully start MongoDB connection before the server", async () => {
    const response = await request(server).get("/");
    expect(response.status).toBe(200);
  });
});
