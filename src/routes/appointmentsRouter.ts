import { Router } from "express";
import { connect } from "../server.js";
import { Appointment } from "../models/appointmentsModel.js";
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
          design: req.body.appointment.services.nails.design,
          extras: req.body.appointment.services.nails.extras,
        },
        pedicure: req.body.appointment.services.pedicure,
        addons: req.body.appointment.services.addons,
      },
    },
  });

  try {
    // const addAppointments = await db.collection("appointments").insertOne();
  } catch (err) {
    res.status(500).json({
      message: "There was an error adding an appointments",
    });
  }
});

export default router;
