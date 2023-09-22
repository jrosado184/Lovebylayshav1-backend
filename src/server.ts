import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { Db, MongoClient, MongoClientOptions } from "mongodb";
import  userRouter  from './routes/userRouter'
import {auth} from "express-openid-connect"
import { config } from './auth0/config'
import expressOpenIdConnect from 'express-openid-connect';
dotenv.config();

const { requiresAuth } = expressOpenIdConnect;


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
server.use(userRouter)
server.use(auth(config))

export const connect = async (): Promise<Db> => {
  try {
    const client = await MongoClient.connect(dbUrl, options);
    return client.db(dbName);
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
};

server.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
server.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});


export default server;
