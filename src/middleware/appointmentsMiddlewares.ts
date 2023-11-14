import { NextFunction, Response, Request } from "express";
import { connect } from "../server.js";
import { ObjectId } from "mongodb";

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
