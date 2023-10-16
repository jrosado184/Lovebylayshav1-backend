import { ObjectId } from "mongodb";
import { connect } from "../server";
import { NextFunction, Request, Response } from "express";
import { GuestUser } from "../models/guestUsersModel";

export const checkIfGuestIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const db = await connect();

  const allUsers = await db.collection("guest_users").find().toArray();

  const userWithIdExists = allUsers.some((a) => String(a._id) === id);

  if (!id || !userWithIdExists) {
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
    const doesGuestUserExist = await db
      .collection("guest_users")
      .find({
        $or: [{ email: email }, { phone_number: phone_number }],
      })
      .toArray();

    if (doesGuestUserExist.length > 0) {
      res.locals.userId = doesGuestUserExist[0]._id.toString();
      next();
    } else {
      const newGuestUserSchema = new GuestUser({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
      });

      const newGuestUser = await db
        .collection("guest_users")
        .insertOne(newGuestUserSchema);

      const getAddedUser = await db
        .collection("guest_users")
        .findOne({ _id: new ObjectId(newGuestUser.insertedId.toString()) });

      res.status(201).json(getAddedUser);

      res.locals.userId = newGuestUser.insertedId.toString();

      next();
    }
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
        $and: [
          { year: year },
          { month: month },
          { day: day },
          { time: time }
        ]
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
    next(error)
  }
};
