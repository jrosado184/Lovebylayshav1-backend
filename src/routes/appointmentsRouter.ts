import { Router } from "express";
import { connect } from "../server.js";
import { Appointment } from "../models/appointmentsModel.js";
import { ObjectId } from "mongodb";
const router = Router();

router.get("/api/auth/appointments", async (req, res) => {
  const db = await connect();

  try {
    const allAppointments = await db
      .collection("appointments")
      .find()
      .toArray();
    res.json(allAppointments);
  } catch (err) {
    res.status(500).json({
      message: "There was an error retreiving the appointments",
      err: err,
    });
  }
});

router.post("/api/auth/appointments", async (req, res) => {
  const db = await connect();

  const appointment = new Appointment({
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
    user_id: req.body.user_id
  });

  try {
    const addedAppointment = await db
      .collection("appointments")
      .insertOne(appointment);

    const getAddedAppointment = await db.collection("appointments").findOne({
      _id: new ObjectId(addedAppointment.insertedId.toString())
    })
    
    await db.collection("registered_users").updateOne({_id: new ObjectId(req.body.user_id)},
    {
      $push: {
        "appointments.upcoming": addedAppointment.insertedId
      }
    })

    res.status(201).json(getAddedAppointment)
  } catch (err) {
    res.status(500).json({
      message: "There was an error adding an appointments",
    });
  }
});

export default router;
