import { NextFunction, Request, Response } from "express";
import { findAllDocuments } from "../database/globalFunctions.js";

export const checkIfTechAlreadyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allTechs = await findAllDocuments("techs");
  const existingTech = allTechs.some(
    (tech) =>
      tech.tech_email === req.body.tech_email ||
      tech.tech_phone_number === req.body.tech_number
  );
  if (existingTech) {
    res.status(401).json({
      message: "a tech with that email or phone number already exists",
    });
  } else {
    next();
  }
};
