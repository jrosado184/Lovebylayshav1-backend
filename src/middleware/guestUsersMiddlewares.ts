import { ObjectId } from "mongodb";
import { connect } from "../server.js";
import { NextFunction, Request, Response } from "express";
import { Appointment } from "../models/appointmentsModel.js";
import generateRandomCode from "../tools/randomCode.js";
import {
  addGuestUserIdToAppointment,
  findDocumentWithEmailOrPhoneNumber,
  insertIntoDatabase,
} from "../database/globalFunctions.js";
import {
  addAppointmentIdToGuestUser,
  addNewGuestUser,
} from "../database/guestsFunctions.js";

export const checkIfGuestIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const db = await connect();

  const userWithExistingId = await db.collection("guest_users").findOne({
    _id: new ObjectId(id),
  });

  if (!id || !userWithExistingId) {
    res.status(404).json({ message: `The user with id ${id} does not exist` });
  } else {
    next();
  }
};

export const checkifGuestProvidedBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    service,
    shape,
    length,
    design,
    extras,
    pedicure,
    inspirations,
  } = req.body;

  const requiredGuetFields =
    first_name &&
    last_name &&
    email &&
    phone_number &&
    (service ||
      shape ||
      length ||
      design ||
      extras ||
      pedicure ||
      inspirations);

  if (!requiredGuetFields) {
    res.status(400).json({
      message: "Please fill all required fields",
    });
  } else {
    next();
  }
};

export const checkIfGuestAlreadyExistsAndAddUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const db = await connect();

  const { email, phone_number } = req.body;

  try {
    const randomCode = await generateRandomCode();
    const appointment = new Appointment({
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
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const addAppointment: any = await insertIntoDatabase(
      "appointments",
      appointment
    );

    const existingGuestUsers: any = await findDocumentWithEmailOrPhoneNumber(
      "guest_users",
      email,
      phone_number
    );

    if (existingGuestUsers.length > 0) {
      res.locals.guestUserId = existingGuestUsers[0]._id.toString();
      await addAppointmentIdToGuestUser(existingGuestUsers, addAppointment);
    } else {
      const newGuestUser: any = await addNewGuestUser(req, addAppointment);

      res.locals.guestUserId = newGuestUser.insertedId.toString();
    }

    await addGuestUserIdToAppointment("appointments", addAppointment, res);
    next();
  } catch (error) {
    next(error);
  }
};

export const checkIfEmailToUpdateExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const db = await connect();
  if (req.body.email) {
    const emailExists = await db
      .collection("guest_users")
      .find({
        email: req.body.email,
      })
      .toArray();
    if (emailExists.length > 0) {
      res.status(400).json({
        message: "Cannot use existing email",
      });
    } else {
      next();
    }
  } else {
    next();
  }
};
