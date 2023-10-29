import express from "express";
import { connect } from "../server";
import { ObjectId } from "mongodb";
import {
  checkIfIdExists,
  checkIfNewUserHasBookedAsGuest,
  checkIfUserProvidedBody,
} from "../middleware/userMiddlewares";
import bcrypt from "bcrypt";
import { User } from "../models/userModel";

const router = express.Router();

router.get("/api/auth/registeredUsers", async (req, res) => {
  const db = await connect();
  try {
    const allRegisteredUsers = await db
      .collection("registered_users")
      .find()
      .toArray();
    res.status(200).json(allRegisteredUsers);
  } catch (err) {
    res.status(500).json({
      message: err,
      custom: "error getting all users",
    });
  }
});

router.get(
  "/api/auth/registeredUsers/:id",
  checkIfIdExists,
  async (req, res) => {
    const db = await connect();
    const userId = req.params.id;

    try {
      const user = await db
        .collection("registered_users")
        .findOne({ _id: new ObjectId(userId) });

      res.json(user);
    } catch (error) {
      res.status(500).json({
        message: `There was an error retreiving the user with id ${userId}`,
      });
    }
  }
);
router.post("/api/auth/registeredUsers", async (req, res) => {
  const db = await connect();

  const upcomingAppointments: any = await checkIfNewUserHasBookedAsGuest(req, res);

  const newUser = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    phone_number: req.body.phone_number,
    date_of_birth: req.body.date_of_birth,
    appointments: {
      upcoming: upcomingAppointments || [],
      past: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),

    administrative_rights: false,
  });

  try {
    const hashedPassword = bcrypt.hash(req.body.password, 10);

    newUser.password = await hashedPassword;

    const addNewUser = await db
      .collection("registered_users")
      .insertOne(newUser);

    const user = await db
      .collection("registered_users")
      .findOne({ _id: new ObjectId(addNewUser.insertedId) });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: "There was an error adding a new user",
      error: error,
    });
  }
});

// router.put(
//   "/api/auth/registeredUsers/:id",
//   checkIfIdExists,
//   checkIfUserProvidedBody,
//   async (req, res) => {
//     const db = await connect();

// const dataToupdateUser = {
//   first_name: req.body.first_name,
//   last_name: req.body.last_name,
//   phone_number: req.body.phone_number,
//   appointments: {
//     upcoming: upcomingAppointments || [],
//     past: [],
//   },
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

//     try {
//       await db
//         .collection("registered_users")
//         .updateOne({ _id: new ObjectId(req.params.id) }, [
//           {
//             $set: { userData: dataToupdateUser },
//           },
//         ]);
//       const user = await db.collection("registered_users").findOne({
//         _id: new ObjectId(req.params.id),
//       });
//       res.json(user);
//     } catch (err) {
//       console.error("Error updating user:", err);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// );

export default router;
