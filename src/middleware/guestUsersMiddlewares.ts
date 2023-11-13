import { ObjectId } from "mongodb";
import { connect } from "../server.js";
import { NextFunction, Request, Response } from "express";
import { GuestUser } from "../models/guestUsersModel.js";
import { Appointment } from "../models/appointmentsModel.js";

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
  const { first_name, last_name, email, phone_number } = req.body;

  const requiredFields = !first_name || !last_name || !email || !phone_number;

  if (requiredFields) {
    res.status(400).json({
      message: "Please fill all required fields",
    });
  } else {
    next();
  }
};

export const checkIfGuestHasMultipleAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction,
  firstAppointmentId?: string
) => {
  const db = await connect();

  const { email, phone_number } = req.body;

  try {
    const allGuestUsers = await db
      .collection("appointments")
      .find({
        email: email,
        phone_number: phone_number,
      })
      .toArray();
    return firstAppointmentId;
  } catch (error) {
    next(error);
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
    });

    const addAppointment = await db
      .collection("appointments")
      .insertOne(appointment);

    const existingGuestUsers = await db
      .collection("guest_users")
      .find({
        $or: [{ email: email }, { phone_number: phone_number }],
      })
      .toArray();

    if (existingGuestUsers.length > 0) {
      res.locals.guestUserId = existingGuestUsers[0]._id.toString();
      await db.collection("guest_users").updateOne(
        { _id: new ObjectId(existingGuestUsers[0]._id.toString()) },
        {
          $push: {
            appointment_id: new ObjectId(addAppointment.insertedId.toString()),
          },
        }
      );
    } else {
      const newGuestUserSchema = new GuestUser({
        appointment_id: new ObjectId(addAppointment.insertedId.toString()),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
      });

      const newGuestUser = await db
        .collection("guest_users")
        .insertOne(newGuestUserSchema);

      res.locals.guestUserId = newGuestUser.insertedId.toString();
    }

    await db.collection("appointments").updateOne(
      { _id: new ObjectId(addAppointment.insertedId.toString()) },
      {
        $set: { user_id: new ObjectId(res.locals.guestUserId) },
      }
    );
    next();
  } catch (error) {
    next(error);
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

    if (appointmentAlreadyExists.length) {
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
        message:
          "Cannot use existing email",
      });
    } else {
      next()
    }
  } else {
    next()
  }
};
