import express from "express";
import { connect } from "../server";
import { GuestUser } from "../models/guestUsersModel";
import { ObjectId } from "mongodb";
import {
  checkIfAppoinmentAlreadyExists,
  checkIfGuestAlreadyExistsAndAddUser,
  checkIfGuestHasMultipleAppointments,
  checkIfGuestIdExists,
  checkifGuestProvidedBody,
} from "../middleware/guestUsersMiddlewares";
import { Appointment } from "../models/appointmentsModel";

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
  checkIfGuestAlreadyExistsAndAddUser,
  checkIfAppoinmentAlreadyExists,
  async (req, res, next) => {
    const db = await connect();

    const guestUserId = res.locals.userId;

    try {
      const appointment = new Appointment({
        user_id: new ObjectId(guestUserId),
        year: req.body.year,
        month: req.body.month,
        day: req.body.day,
        time: req.body.time,
        services: {
          nails: {
            fullSet: req.body.services.nails.fullSet,
            refill: req.body.services.nails.refill,
            shape: req.body.services.nails.shape,
            length: req.body.services.nails.length,
            design: req.body.services.nails.design,
            extras: req.body.services.nails.extras,
          },
          pedicure: req.body.services.pedicure,
          addons: req.body.services.addons,
        },
      });

      const addAppointment = await db
        .collection("appointments")
        .insertOne(appointment);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  }
);

export default router;
