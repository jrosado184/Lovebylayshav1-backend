import express from "express";
import { connect } from "../server";
import { ObjectId } from "mongodb";
import {
  checkIfAppoinmentAlreadyExists,
  checkIfGuestAlreadyExistsAndAddUser,
  checkIfGuestIdExists,
  checkifGuestProvidedBody,
} from "../middleware/guestUsersMiddlewares";

const router = express.Router();

router.get("/api/auth/guestUsers", async (req, res) => {
  const db = await connect();

  try {
    const allGuestUsers = await db.collection("guest_users").find().toArray();
    res.json(allGuestUsers);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get(
  "/api/auth/guestUsers/:id",
  checkIfGuestIdExists,
  async (req, res) => {
    const db = await connect();

    try {
      const userId = req.params.id;
      const user = await db
        .collection("guest_users")
        .findOne({ _id: new ObjectId(userId) });
      res.json(user);
    } catch (error) {
      res.json({
        message:
          "There was an error retreiving a user from the guest users collection",
        error: error,
      });
    }
  }
);

router.post(
  "/api/auth/guestUsers",
  checkifGuestProvidedBody,
  checkIfAppoinmentAlreadyExists,
  checkIfGuestAlreadyExistsAndAddUser,
  async (req, res, next) => {
    const db = await connect();

    const guestUserId = res.locals.guestUserId;

    try {
        const guestUser = await db
          .collection("guest_users")
          .findOne({ _id: new ObjectId(guestUserId) });

          const guestUserAppointment = await db.collection("appointments").findOne({user_id: new ObjectId(guestUserId)})

          const guestUserWithAppointmentInformation = {
            guestUser,
            guestUserAppointment
          }

        res.status(201).json(guestUserWithAppointmentInformation)

    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  }
);


export default router;
