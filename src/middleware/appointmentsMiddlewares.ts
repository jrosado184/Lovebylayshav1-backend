import { NextFunction, Response, Request } from "express";
import { connect } from "../server.js";
import { ObjectId } from "mongodb";
import { getGuestUser } from "../database/guestsFunctions.js";
import {
  deleteDocumentById,
  findOneDocumentById,
} from "../database/globalFunctions.js";

export const checkUpdateBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body) {
    res.json({
      message: "Please provide a field to update",
    });
  }
  next();
};

export const checkIfIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const db = await connect();

  const appointment = await db.collection("appointments").findOne({
    _id: new ObjectId(req.params.id),
  });

  if (!appointment) {
    res.status(400).json({
      message: `Appointment with id ${req.params.id} does not exist`,
    });
  } else {
    next();
  }
};

export const checkIfAppoinmentAlreadyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { year, month, day, time } = req.body;

  try {
    const db = await connect();

    const appointmentAlreadyExists = await db
      .collection("appointments")
      .find({
        $and: [{ year: year }, { month: month }, { day: day }, { time: time }],
      })
      .toArray();

    if (appointmentAlreadyExists.length > 0) {
      res.status(400).json({
        message: "This appointment has already been booked",
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const removeGuestUserIfOnlyOneAppointmentExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const db = await connect();
    const guestUser = await db.collection("guest_users").findOne({
      appointment_id: new ObjectId(req.params.id),
    });

    if (guestUser) {
      if (guestUser.appointment_id.length === 1) {
        // If the guest user has only one appointment, delete both
        await deleteDocumentById("guest_users", guestUser._id);
        await deleteDocumentById("appointments", req.params.id);
      } else {
        // If the guest user has more than one appointment, delete only the appointment
        await deleteDocumentById("appointments", req.params.id);
      }
    }

    next();
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};
