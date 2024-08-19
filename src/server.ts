import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { Db, MongoClient } from "mongodb";
import userRouter from "./routes/userRouter.js";
import guestUserRouter from "./routes/guestUserRouter.js";
import appointmentsRouter from "./routes/appointmentsRouter.js";
import galleryRouter from "./routes/galleryRouter.js";
import authRouter from "./routes/authRouter.js";
import configENV from "./configENV.js";
import session from "express-session";
import MongoDBStore from "connect-mongodb-session";
import "./passport-config.js";
import passport from "passport";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import bodyParser from "body-parser";
import ip from "ip";
dotenv.config();

const server: Application = express();

export const dbUri = configENV.dbUri;

const store = new (MongoDBStore(session))({
  uri: dbUri,
  collection: "sessions",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://www.lovebylaysha.com"
      : [
          `http://${ip.address()}:${process.env.FRONT_END_PORT}`,
          `http://localhost:${process.env.FRONT_END_PORT}`,
        ], // Dynamic IP address for development
  credentials: true,
};

server.use(bodyParser.json({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
server.use(express.json());
server.use(fileUpload());
server.use(cors(corsOptions));
server.use(morgan("dev"));
server.use(
  session({
    secret: process.env.SECRET ?? "",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hour expiration
      httpOnly: true, // Helps to prevent cross-site scripting attacks
      secure: process.env.NODE_ENV === "production", // Only send cookies over HTTPS in production
      sameSite: "lax", // CSRF protection,
    },
    store: store,
  })
);
server.use(passport.initialize());
server.use(passport.session());
server.use(userRouter);
server.use(guestUserRouter);
server.use(appointmentsRouter);
server.use(authRouter);
server.use(galleryRouter);

export const connect = async (): Promise<Db> => {
  try {
    const client = await MongoClient.connect(dbUri, {});
    return client.db();
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
};

server.get("/", (req, res) => {
  res.status(200).json("Lovebylaysha's server");
});

export default server;
