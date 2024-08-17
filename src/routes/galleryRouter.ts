import { Router } from "express";
import { Gallery } from "./../models/galleryModel.js";
import {
  deleteDocumentById,
  findAllDocuments,
  findOneDocumentById,
  insertIntoDatabase,
} from "../database/globalFunctions.js";
import { authenticate } from "../middleware/authMiddlewares.js";
import { connect } from "../server.js";

const router = Router();

router.get("/api/auth/gallery", async (req, res) => {
  try {
    const db = await connect();
    const imagesWithUserDetails = await db
      .collection("gallery")
      .aggregate([
        {
          $lookup: {
            from: "registered_users",
            foreignField: "_id",
            localField: "user_id",
            as: "user_information",
          },
        },
        {
          $unwind: "$user_information",
        },
        {
          $project: {
            url: 1,
            tags: 1,
            category: 1,
            upload_date: 1,
            title: 1,
            "user_information.first_name": 1,
            "user_information.last_name": 1,
            "user_information.avatar": 1,
          },
        },
      ])
      .toArray();
    res.json(imagesWithUserDetails);
  } catch (error) {
    console.log(error);
  }
});

router.get("/api/auth/gallery/:id", async (req, res) => {
  try {
    const getGalleryById = await findOneDocumentById("gallery", req.params.id);
    res.json(getGalleryById);
  } catch (error: any) {
    throw Error(error);
  }
});

router.post("/api/auth/gallery", authenticate, async (req, res) => {
  try {
    const newImage = new Gallery({
      user_id: req.body.user_id,
      category: req.body.category,
      url: req.body.url,
      title: req.body.title,
      upload_date: new Date(),
      tags: req.body.tags,
    });
    const insertImage = await insertIntoDatabase("gallery", newImage);
    const image = await findOneDocumentById("gallery", insertImage.insertedId);
    res.status(201).json(image);
  } catch (error: any) {
    throw Error(error);
  }
});

router.delete("/api/auth/gallery/:id", async (req, res) => {
  try {
    await findOneDocumentById("gallery", req.params.id);
    const response = await deleteDocumentById("gallery", req.params.id);
    res.json(response);
  } catch (error: any) {
    throw Error(error);
  }
});

export default router;

//FINISH TESTING
//TODO:
//CONNECT CLOUDINARY TO THE GALLERY ROUTE
//SET UP USER, ADMIN AND SUPER ADMIN FUNCTIONS
