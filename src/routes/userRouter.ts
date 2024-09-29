import express from "express";
import { connect } from "../server.js";
import { ObjectId } from "mongodb";
import {
  checkIfIdExists,
  checkIfNewUserHasBookedAsGuest,
  checkIfUserAlreadyExists,
  checkIfUserHasUpcomingAppointments,
  checkIfUserProvidedBody,
  checkUpdateBody,
} from "../middleware/userMiddlewares.js";
import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";

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
        .aggregate([
          {
            $match: {
              _id: new ObjectId(userId),
            },
          },
          {
            // Lookup upcoming appointments
            $lookup: {
              from: "appointments",
              localField: "appointments.upcoming",
              foreignField: "_id",
              as: "upcomingAppointments",
            },
          },
          {
            // Unwind the upcoming appointments to process them individually
            $unwind: "$upcomingAppointments",
          },
          {
            // Lookup the tech details for each appointment
            $lookup: {
              from: "techs",
              localField: "upcomingAppointments.tech_id",
              foreignField: "_id",
              as: "techDetails",
            },
          },
          {
            // Unwind the tech details
            $unwind: {
              path: "$techDetails",
              preserveNullAndEmptyArrays: true, // In case there's no tech for the appointment
            },
          },
          {
            // Rebuild the user document with the merged appointments and tech details
            $group: {
              _id: "$_id",
              first_name: { $first: "$first_name" },
              last_name: { $first: "$last_name" },
              email: { $first: "$email" },
              phone_number: { $first: "$phone_number" },
              avatar: { $first: "$avatar" },
              createdAt: { $first: "$createdAt" },
              updatedAt: { $first: "$updatedAt" },
              role: { $first: "$role" },
              upcomingAppointments: {
                $push: {
                  $mergeObjects: [
                    "$upcomingAppointments",
                    { tech: "$techDetails" }, // Merges tech details into the appointment
                  ],
                },
              },
            },
          },
          {
            // Final projection to format the output
            $project: {
              first_name: 1,
              last_name: 1,
              email: 1,
              phone_number: 1,
              avatar: 1,
              createdAt: 1,
              updatedAt: 1,
              role: 1,
              "appointments.upcoming": "$upcomingAppointments",
            },
          },
        ])
        .toArray();

      if (user.length >= 0) {
        res.json(user[0]);
      } else {
        res.status(404).json({
          message: `User with id ${userId} not found`,
        });
      }
    } catch (error: any) {
      res.status(500).json({
        message: `There was an error retrieving the user with id ${userId}`,
        error: error?.message,
      });
    }
  }
);
router.post(
  "/api/auth/registeredUsers",
  checkIfUserProvidedBody,
  checkIfUserAlreadyExists,
  async (req, res) => {
    try {
      const db = await connect();

      const upcomingAppointments = await checkIfNewUserHasBookedAsGuest(
        req,
        res
      );

      const newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        phone_number: req.body.phone_number,
        date_of_birth: req.body.date_of_birth,
        avatar: req.body.avatar,
        appointments: {
          upcoming: upcomingAppointments || [],
          past: [],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        administrative_rights: false,
      });

      // Await the password hashing to make sure it's done
      newUser.password = await bcrypt.hash(req.body.password, 10);

      // Insert the new user into the database
      const addNewUser = await db
        .collection("registered_users")
        .insertOne(newUser);

      // Query the database to ensure we have the complete user
      const user: any = await db
        .collection("registered_users")
        .findOne({ _id: new ObjectId(addNewUser.insertedId) });

      // Update any guest appointments with the new user ID
      if (upcomingAppointments) {
        for (const appointmentId of upcomingAppointments) {
          await db.collection("appointments").updateOne(
            { _id: new ObjectId(appointmentId) },
            {
              $set: {
                user_id: user?._id,
              },
            }
          );
        }
      }

      // Ensure the user is fully logged in after registration
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({
            message:
              "Registration successful, but there was an issue logging you in.",
            error: err,
          });
        }

        // Send the logged-in user data back as the response
        res.status(201).json(user);
      });
    } catch (error) {
      res.status(500).json({
        message: "There was an error adding a new user",
        error: error,
      });
    }
  }
);

router.put(
  "/api/auth/registeredUsers/:id",
  checkIfIdExists,
  checkUpdateBody,
  async (req, res) => {
    const db = await connect();

    const dataToupdateUser = req.body;
    const id = req.params.id;

    try {
      await db
        .collection("registered_users")
        .updateOne({ _id: new ObjectId(id) }, [
          {
            $set: dataToupdateUser,
          },
        ]);
      const user = await db.collection("registered_users").findOne({
        _id: new ObjectId(id),
      });
      res.json(user);
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.delete(
  "/api/auth/registeredUsers/:id",
  checkIfUserHasUpcomingAppointments,
  async (req, res, next) => {
    const db = await connect();
    try {
      const deleteRegisteredUser = await db
        .collection("registered_users")
        .deleteOne({
          _id: new ObjectId(req.params.id),
        });
      if (deleteRegisteredUser.deletedCount === 1) {
        await db.collection("sessions").findOneAndDelete({
          "session.passport.user": req.params.id,
        });
        res.json("User was successfully deleted");
      }
    } catch (error) {
      res.status(500).json({
        error: error,
      });
    }
  }
);

export default router;
