import { Router } from "express";
import { connect } from "../server.js";
import { Gallery } from "../models/galleryModel.js";
import {
  findAllDocuments,
  insertIntoDatabase,
} from "../database/globalFunctions.js";

const router = Router();

router.get("/api/auth/gallery", async (req, res) => {
  try {
    findAllDocuments("gallery").then((images) => res.json(images));
  } catch (error: any) {
    throw Error(error);
  }
});

router.post("/api/auth/gallery", async (req, res) => {
  try {
    const newImage = new Gallery({
      user_id: req.body.user_id,
      category: req.body.category,
      url: req.body.url,
      title: req.body.title,
      upload_date: new Date(),
      tags: req.body.tags,
    });
    const image = insertIntoDatabase("gallery", newImage);
    res.json(image);
  } catch (error: any) {
    throw Error(error);
  }
});

export default router;

// LEFT OFF DESIGNING THE GALLERY ROUTER
//TODO:
//CONNECT CLOUDINARY TO ITS OWN ROUTER
// DESIGN THE UPLOAD MODAL
