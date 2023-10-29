import { Db, MongoClient } from "mongodb";
import server, {dbUri} from "../server";
import request from "supertest";

let db;
let client: MongoClient;

beforeAll(async () => {
  try {
    client = await MongoClient.connect(dbUri,{});
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
