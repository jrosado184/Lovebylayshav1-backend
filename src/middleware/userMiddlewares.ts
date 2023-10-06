import { ObjectId } from "mongodb";
import { connect } from "../server";
import { NextFunction, Request, Response } from "express";

export const checkIfNewUserHasBookedAsGuest = async (
  req: Request,
  res: Response
) => {
  const db = await connect();
  let user = await db.collection("registered_users").findOne({
    _id: new ObjectId(req.params.id),
  });

  const userAppointmentExistsInGuestsCollection = await db
    .collection("guest_users")
    .find({
      email: user?.email,
    })
    .toArray();

  return userAppointmentExistsInGuestsCollection.map((appointments) => ({
    _id: appointments._id,
    appointment: appointments.appointment,
  }));
};

export const checkIfIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const db = await connect();

  const allUsers = await db.collection("registered_users").find().toArray();

  const userWithIdExists = allUsers.some((a) => String(a._id) === id);

  if (!id || !userWithIdExists) {
    res.status(404).json({ message: `The user with id ${id} does not exist` });
  } else {
    next();
  }
};
