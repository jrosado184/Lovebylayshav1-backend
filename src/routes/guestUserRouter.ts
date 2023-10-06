import express from "express";
import { connect } from "../server";
import { GuestUser } from "../models/guestUsersModel";
import { ObjectId } from "mongodb";

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

router.post("/api/auth/guestUsers", async (req, res) => {
  const db = await connect();

  try {
    const newGuestUser = new GuestUser({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      appointment: {
        year: req.body.appointment.year,
        month: req.body.appointment.month,
        day: req.body.appointment.day,
        time: req.body.appointment.time,
        services: {
          nails: {
            fullSet: req.body.appointment.services.nails.fullSet,
            refill: req.body.appointment.services.nails.refill,
            shape: req.body.appointment.services.nails.shape,
            length: req.body.appointment.services.nails.length,
            designs: req.body.appointment.services.nails.designs,
            extras: req.body.appointment.services.nails.extras,
          },
          pedicure: req.body.appointment.services.pedicure,
          addons: req.body.appointment.services.addons,
        },
      },
    });

    const addGUestUser = await db
      .collection("guest_users")
      .insertOne(newGuestUser);

    const getAddedUser = await db
      .collection("guest_users")
      .findOne({ _id: new ObjectId(addGUestUser.insertedId) });
    res.status(201).json(getAddedUser);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

export default router;
