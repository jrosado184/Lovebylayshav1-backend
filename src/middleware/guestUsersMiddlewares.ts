import { ObjectId } from "mongodb";
import { connect } from "../server";
import { NextFunction, Request, Response } from "express";

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

export const checkifGuestProvidedBody = (req: Request, res: Response, next: NextFunction) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    appointment: { year, month, day },
  } = req.body;

  const requiredFields =
    !first_name ||
    !last_name ||
    !email ||
    !phone_number ||
    !year ||
    !month ||
    !day;

  if (requiredFields) {
    res.status(400).json({
      message: "Please fill all required fields"
    })
  } else {
    next()
  }
};
