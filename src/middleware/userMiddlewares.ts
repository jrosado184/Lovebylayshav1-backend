import { connect } from "../server";
import { NextFunction, Request, Response } from "express";

export const checkIfNewUserHasBookedAsGuest = async (
  req: Request,
  res: Response
) => {
  const db = (await connect());

  const appointments = await db
    .collection("guest_users")
    .aggregate([
      {
        $match: {
          email: req.body.email,
        },
      },
      {
        $unwind: "$appointment_id", 
      },
      {
        $project: {
          _id:"$appointment_id"
        },
      },
    ])
    .toArray();

    if(appointments.length) {
      await db.collection("guest_users").findOneAndDelete({ email: req.body.email })
    }
    return appointments.map((appointment) => appointment._id)

  
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

export const checkIfUserProvidedBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { first_name, last_name } = req.body;

  if (!first_name || !last_name) {
    res.status(400).json({
      message: "Please provide a first name and last name",
    });
  } else {
    next();
  }
};
