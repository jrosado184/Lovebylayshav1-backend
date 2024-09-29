import { ObjectId } from "mongodb";
import { connect } from "../server.js";
import { NextFunction, Request, Response } from "express";

export const checkIfNewUserHasBookedAsGuest = async (
  req: Request,
  res: Response
) => {
  const db = await connect();

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
          _id: "$appointment_id",
        },
      },
    ])
    .toArray();

  if (appointments.length) {
    await db
      .collection("guest_users")
      .findOneAndDelete({ email: req.body.email });

    return appointments.map((appointment) => appointment._id);
  }
};

export const checkIfUserAlreadyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const db = await connect();

  const { email } = req.body;

  const userExists = await db
    .collection("registered_users")
    .find({
      email: email,
    })
    .toArray();
  if (userExists.length > 0) {
    res.status(409).json({ message: "a user with that email already exists" });
  } else {
    next();
  }
};

export const checkIfIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "No ID provided" });
  }

  try {
    const db = await connect();
    const user = await db
      .collection("registered_users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res
        .status(404)
        .json({ message: `The user with id ${id} does not exist` });
    }

    next(); // Proceed to the next middleware/route handler
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error checking user ID", error: error.message });
  }
};
export const checkIfUserProvidedBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { first_name, last_name, email, phone_number, password } = req.body;

  if (!first_name || !last_name || !email || !phone_number || !password) {
    res.status(400).json({
      message: "Please provide a first name and last name",
    });
  } else {
    next();
  }
};

export const checkUpdateBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { first_name, last_name, email, phone_number, password } = req.body;

  if (!first_name && !last_name && !email && !phone_number && !password) {
    res.status(400).json({ message: "Please enter a field to update" });
  } else {
    next();
  }
};

export const checkIfUserHasUpcomingAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const db = await connect();
  try {
    const userAppointments = await db
      .collection("appointments")
      .find({ user_id: new ObjectId(req.params.id) })
      .toArray();

    if (userAppointments.length) {
      res.status(409).json({
        message: "Cannot delete account with upcoming appointment",
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};
