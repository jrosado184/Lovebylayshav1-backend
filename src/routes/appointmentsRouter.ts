import { Router } from "express";
import { connect } from "../server.js";
import { Appointment } from "../models/appointmentsModel.js";
import { ObjectId } from "mongodb";
import {
  checkIfIdExists,
  checkUpdateBody,
} from "../middleware/appointmentsMiddlewares.js";
import { checkIfAppoinmentAlreadyExists } from "../middleware/guestUsersMiddlewares.js";
import {
  deleteDocumentById,
  findOneDocumentById,
  updateDocumentById,
} from "../database/globalFunctions.js";

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

router.post(
  "/api/auth/appointments",
  checkIfAppoinmentAlreadyExists,
  async (req, res) => {
    const db = await connect();

    const appointment = new Appointment({
      year: req.body.year,
      month: req.body.month,
      day: req.body.day,
      time: req.body.time,
      service: req.body.services.nails.service,
      shape: req.body.services.nails.shape,
      length: req.body.services.nails.length,
      design: req.body.services.nails.design,
      extras: req.body.services.nails.extras,
      pedicure: req.body.services.pedicure,
      inspirations: req.body.services.inspirations,
      user_id: req.body.user_id,
    });

    try {
      const addedAppointment = await db
        .collection("appointments")
        .insertOne(appointment);

      const getAddedAppointment = await db.collection("appointments").findOne({
        _id: new ObjectId(addedAppointment.insertedId.toString()),
      });

      await db.collection("registered_users").updateOne(
        { _id: new ObjectId(req.body.user_id) },
        {
          $push: {
            "appointments.upcoming": addedAppointment.insertedId,
          },
        }
      );

      res.status(201).json(getAddedAppointment);
    } catch (err) {
      res.status(500).json({
        message: "There was an error adding an appointments",
      });
    }
  }
);

router.put(
  "/api/auth/appointments/:id",
  checkUpdateBody,
  checkIfAppoinmentAlreadyExists,
  async (req, res) => {
    const db = await connect();
    try {
      await updateDocumentById(
        db,
        "appointments",
        req,
        req.body
      ).then((user: any) => {
        if (user.modifiedCount === 1) {
          findOneDocumentById(db, "appointments", req).then(
            user => {
              res.json(user);
            }
          )
          
        }
      })
    } catch (error) {
      res.status(500).json({
        message: "There was an error updating appointment",
        error: error,
      });
    }
  }
);

router.delete(
  "/api/auth/appointments/:id",
  checkIfIdExists,
  async (req, res) => {
    const db = await connect();

    try {
      await deleteDocumentById(db, "appointments", req).then((data: any) => {
        if (data.deletedCount === 1) {
          res.status(200).json({
            message: "appointment successfully deleted",
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal Error, There was an error deleting appointment",
        error: error,
      });
    }
  }
);

export default router;
