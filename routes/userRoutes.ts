import express, { Request, Response } from "express";
import { connect } from "../server";
import { User } from '../models/userModel'
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/api/registeredUsers", async (req, res) => {
  const db = await connect();
  try {
    const allRegisteredUsers = await db.collection("users").find().toArray();
    res.status(200).json(allRegisteredUsers);
  } catch (err) {
    res.status(500).json({
      message: err,
      custom: "error getting all users",
    });
  }
});

router.post(
    "/api/registerUser",
    async (req: Request, res: Response) => {

      const db = await connect();
      
      try {
        const newUserInformation = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          phone_number: req.body.phone_number,
          date_of_birth: req.body.date_of_birth
        });
  
        const addUser = await db.collection("users").insertOne(newUserInformation);
  
        const newUser = await db
          .collection("users")
          .findOne({ _id: new ObjectId(addUser.insertedId) });
        res.status(200).json(newUser);
      } catch (err) {
        res.status(500);
        console.error({
          error: "An error occurred during adding document of user",
        });
      }
    }
  );
  

export default router;
