import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { Db, MongoClient } from "mongodb";
import  userRouter  from './routes/userRouter'
import guestUserRouter from "./routes/guestUserRouter"
import {auth} from "express-openid-connect"
import { config } from './auth0/config'
import expressOpenIdConnect from 'express-openid-connect';
import configENV from './configENV'
dotenv.config();

const { requiresAuth } = expressOpenIdConnect;

export const options = {}

export const dbUri = configENV.dbUri??"";

const server: Application = express();

server.use(bodyParser.json());
server.use(express.json());
server.use(cors());
server.use(morgan("dev"));
server.use(userRouter)
server.use(guestUserRouter)
server.use(auth(config))

export const connect = async (): Promise<Db> => {
  try {
    const client = await MongoClient.connect(dbUri, options);
    return client.db()
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
