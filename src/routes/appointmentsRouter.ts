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
  findAllDocuments,
  findOneDocumentById,
  insertIntoDatabase,
  throwError,
  updateDocumentById,
} from "../database/globalFunctions.js";
import { addAppointmentIdToRegisteredUser } from "../database/appointmentFunctions.js";

const router = Router();

router.get("/api/auth/appointments", async (req, res) => {
  try {
    findAllDocuments("appointments").then((appointments) => {
      res.json(appointments);
    });
  } catch (err) {
    throwError(err, res);
  }
});

router.post(
  "/api/auth/appointments",
  checkIfAppoinmentAlreadyExists,
  async (req, res) => {
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
      const db = await connect();

      insertIntoDatabase("appointments", appointment).then(
        (addedAppointment: any) => {
          addAppointmentIdToRegisteredUser(addedAppointment, req).then(() => {
            findOneDocumentById(
              "appointments",
              addedAppointment.insertedId
            ).then((user) => {
              res.status(201).json(user);
            });
          });
        }
      );
    } catch (err) {
      throwError(err, res);
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
      await updateDocumentById("appointments", req, req.body).then(
        (user: any) => {
          if (user.modifiedCount === 1) {
            findOneDocumentById("appointments", req.params.id).then((user) => {
              res.json(user);
            });
          }
        }
      );
    } catch (error) {
      throwError(error, res);
    }
  }
);

router.delete(
  "/api/auth/appointments/:id",
  checkIfIdExists,
  async (req, res) => {
    const db = await connect();

    try {
      await deleteDocumentById("appointments", req).then((data: any) => {
        if (data.deletedCount === 1) {
          res.status(200).json({
            message: "appointment successfully deleted",
          });
        }
      });
    } catch (error) {
      throwError(error, res);
    }
  }
);

export default router;
