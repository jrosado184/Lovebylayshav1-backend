import express from "express";
import { connect } from "../server.js";
import { Db, ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import {
  checkIfAppoinmentAlreadyExists,
  checkIfEmailToUpdateExists,
  checkIfGuestAlreadyExistsAndAddUser,
  checkIfGuestIdExists,
  checkifGuestProvidedBody,
} from "../middleware/guestUsersMiddlewares.js";

const router = express.Router();

router.get("/api/auth/guestUsers", async (req, res) => {
  const db = await connect();

  try {
    const allGuestUsers = await db.collection("guest_users").find().toArray();
    res.json(allGuestUsers);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get(
  "/api/auth/guestUsers/:id",
  checkIfGuestIdExists,
  async (req, res) => {
    const db = await connect();

    try {
      const userId = req.params.id;
      const user = await db
        .collection("guest_users")
        .findOne({ _id: new ObjectId(userId) });
      res.json(user);
    } catch (error) {
      res.json({
        message:
          "There was an error retreiving a user from the guest users collection",
        error: error,
      });
    }
  }
);

router.post(
  "/api/auth/guestUsers",
  checkifGuestProvidedBody,
  checkIfAppoinmentAlreadyExists,
  checkIfGuestAlreadyExistsAndAddUser,
  async (req, res, next) => {
    const db = await connect();

    const guestUserId = res.locals.guestUserId;

    try {
      const guestUser = await getGuestUser(db, guestUserId);

      await uploadImagesToCloud(db, guestUserId, req);

      const updatedGuestUser = await getGuestAppointment(db, guestUserId);

      const guestUserWithAppointmentInformation = {
        ...guestUser,
        ...updatedGuestUser,
      };

      res.status(201).json(guestUserWithAppointmentInformation);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

const getGuestUser = (db: Db, guestUserId: string) => {
  return db
    .collection("guest_users")
    .findOne(
      { _id: new ObjectId(guestUserId) },
      { projection: { appointment_id: 0, user_id: 0 } }
    );
};

const getGuestAppointment = (db: Db, guestUserId: string) => {
  return db
    .collection("appointments")
    .findOne(
      { user_id: new ObjectId(guestUserId) },
      { projection: { user_id: 0 } }
    );
};

const updateAppointment = async (db: Db, guestUserId: string, req: any) => {
  await db
    .collection("appointments")
    .updateOne(
      { user_id: new ObjectId(guestUserId) },
      { $set: { inspirations: req?.body?.inspirations } }
    );
  return getGuestAppointment(db, guestUserId);
};

const uploadImagesToCloud = async (db: Db, guestUserId: string, req: any) => {
  const { inspirations } = req.body;

  if (inspirations && inspirations.length > 0) {
    for (let i = 0; i < inspirations.length; i++) {
      const image = await cloudinary.uploader.upload(inspirations[i]);
      inspirations[i] = { url: image.url, public_id: image.public_id };
    }
    await updateAppointment(db, guestUserId, req);
  }
};

router.put(
  "/api/auth/guestUsers/:id",
  checkIfGuestIdExists,
  checkIfAppoinmentAlreadyExists,
  checkIfEmailToUpdateExists,
  async (req, res) => {
    const db = await connect();
    const guestUserId = req.params.id;
    const guestUserInfo = req.body;

    try {
      const updateGuestUser = await db.collection("guest_users").updateOne(
        {
          _id: new ObjectId(guestUserId),
        },
        {
          $set: guestUserInfo,
        }
      );
      const updatedGuestUser = await db.collection("guest_users").findOne({
        _id: new ObjectId(guestUserId),
      });

      if (updateGuestUser.matchedCount === 1) {
        res.json(updatedGuestUser);
      }
    } catch (error) {
      res.status(500).json({
        message: `There was an error updating the current user with id, ${guestUserId}`,
        error: error,
      });
    }
  }
);

router.delete("/api/auth/guestUsers/:id", async (req, res) => {
  const db = await connect();
  try {
    const deleteGuestUser = await db.collection("guest_users").deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (deleteGuestUser.deletedCount === 1) {
      res.json("Guest user successfully deleted");
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
});

export default router;
