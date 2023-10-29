import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { Db, MongoClient } from "mongodb";
import userRouter from "./routes/userRouter";
import guestUserRouter from "./routes/guestUserRouter";
import appointmentsRouter from "./routes/appointmentsRouter";
import authRouter from "./routes/authRouter";
import configENV from "./configENV";
import session from "express-session";
import MongoDBStore from "connect-mongodb-session";
import "./passport-config";
import passport from "passport";
dotenv.config();

const server: Application = express();

export const dbUri = configENV.dbUri ?? "";

const store = new (MongoDBStore(session))({
  uri: dbUri,
  collection: "sessions",
});

server.use(express.json());
server.use(cors());
server.use(morgan("dev"));
server.use(
  session({
    secret: process.env.SECRET ?? "",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 },
    store: store,
  })
);

server.use(passport.initialize());
server.use(passport.session());
server.use(userRouter);
server.use(guestUserRouter);
server.use(appointmentsRouter);
server.use(authRouter);

export const connect = async (): Promise<Db> => {
  try {
    const client = await MongoClient.connect(dbUri, {});
    return client.db();
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
};

server.get("/", (req,res) => {
  res.status(200).json("Lovebylaysha's server")
})

export default server;
