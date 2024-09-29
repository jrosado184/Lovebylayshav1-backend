import { Router } from "express";
import { connect } from "../server.js";
import { ObjectId } from "mongodb";
import { Appointment } from "../models/appointmentsModel.js";
import {
  checkIfIdExists,
  checkUpdateBody,
  removeGuestUserIfOnlyOneAppointmentExists,
} from "../middleware/appointmentsMiddlewares.js";
import { checkIfAppoinmentAlreadyExists } from "../middleware/appointmentsMiddlewares.js";
import {
  deleteDocumentById,
  findAllDocuments,
  findOneDocumentById,
  insertIntoDatabase,
  throwError,
  updateDocumentAndPushById,
  updateDocumentById,
} from "../database/globalFunctions.js";
import { addAppointmentIdToRegisteredUser } from "../database/appointmentFunctions.js";
import generateRandomCode from "../tools/randomCode.js";

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
    const randomCode = await generateRandomCode();
    const appointment = new Appointment({
      tech_id: req.body.tech_id,
      confirmation_code: randomCode,
      year: req.body.year,
      month: req.body.month,
      day: req.body.day,
      time: req.body.time,
      service: req.body.service,
      shape: req.body.shape,
      length: req.body.length,
      design: req.body.design,
      extras: req.body.extras,
      pedicure: req.body.pedicure,
      inspirations: req.body.inspirations,
      user_id: req.body.user_id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      insertIntoDatabase("appointments", appointment).then(
        (addedAppointment: any) => {
          addAppointmentIdToRegisteredUser(addedAppointment, req).then(() => {
            findOneDocumentById(
              "appointments",
              addedAppointment.insertedId
            ).then((user) => {
              updateDocumentAndPushById(
                "techs",
                {
                  tech_appointments: new ObjectId(user?._id),
                },
                undefined,
                user?.tech_id
              );
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

//LEFT OFF ADDING APPOINTMENT ID TO TECHS APPOINTMENTS
//TODO: FIGURE OUT WHAT WAY TO CAPTURE TECH INFO
//WRITE TESTS FOR THESE ACTIONS

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
  removeGuestUserIfOnlyOneAppointmentExists,
  async (req, res) => {
    try {
      res.status(200).json({
        message: "appointment successfully deleted",
      });
    } catch (error) {
      throwError(error, res);
    }
  }
);

export default router;
