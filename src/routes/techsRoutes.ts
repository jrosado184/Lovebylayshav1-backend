import express, { NextFunction, Request, Response } from "express";
import { connect } from "../server.js";
import { Tech } from "../models/techsModel.js";
import {
  findOneDocumentById,
  insertIntoDatabase,
} from "../database/globalFunctions.js";
import { checkIfTechAlreadyExists } from "../middleware/techsMiddlewares.js";

const router = express.Router();

router.get("/api/techs", async (req, res) => {
  const db = await connect();
  try {
    const allTechs = await db.collection("techs").find().toArray();
    res.json(allTechs);
  } catch (error: any) {
    throw new Error(error);
  }
});

router.post(
  "/api/techs",
  checkIfTechAlreadyExists,
  async (req: Request, res: Response) => {
    const newTech = new Tech({
      tech_name: req.body.tech_name,
      tech_email: req.body.tech_email,
      tech_phone_number: req.body.tech_phone_number,
      tech_avatar: req.body.tech_avatar,
      tech_profession: req.body.tech_profession,
      tech_appointments: [],
    });
    insertIntoDatabase("techs", newTech).then((tech) => {
      findOneDocumentById("techs", tech.insertedId).then((foundTech) => {
        res.json(foundTech);
      });
    });
  }
);

export default router;
