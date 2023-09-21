import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { Db, MongoClient, MongoClientOptions } from "mongodb";
import  userRoutes  from './routes/userRoutes'
dotenv.config();

interface customMongoClientOptions extends MongoClientOptions {
  useUnifiedTopology?: boolean;
}

const options: customMongoClientOptions = {
    useUnifiedTopology: true,
};

const dbName = process.env.MONGO_DB_DATABASE_NAME;
const dbUrl = process.env.MONGO_DB_DATABASE_URL ?? "";

const server: Application = express();

server.use(bodyParser.json());
server.use(express.json());
server.use(cors());
server.use(morgan("dev"));
server.use(userRoutes)

export const connect = async (): Promise<Db> => {
  try {
    const client = await MongoClient.connect(dbUrl, options);
    return client.db(dbName);
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
};

export default server;
