import express from "express";
import { connect } from "../server.js";
import { ObjectId } from "mongodb";
import {
  checkIfAppoinmentAlreadyExists,
  checkIfEmailToUpdateExists,
  checkIfGuestAlreadyExistsAndAddUser,
  checkIfGuestIdExists,
  checkifGuestProvidedBody,
} from "../middleware/guestUsersMiddlewares.js";
import {
  getGuestAppointment,
  getGuestUser,
} from "../database/guestsFunctions.js";
import { uploadImagesToCloud } from "../cloudinary/cloudinaryFunctions.js";
import {
  deleteDocumentById,
  findAllDocuments,
  findOneDocumentById,
  throwError,
  updateDocumentById,
} from "../database/globalFunctions.js";

const router = express.Router();

router.get("/api/auth/guestUsers", async (req, res) => {
  const db = await connect();

  try {
    findAllDocuments(db, "guest_users").then((users) => {
      res.json(users);
    });
  } catch (error) {
    throwError(error, res);
  }
});

router.get(
  "/api/auth/guestUsers/:id",
  checkIfGuestIdExists,
  async (req, res) => {
    const db = await connect();

    try {
      findOneDocumentById(db, "guest_users", req).then((user) => {
        res.json(user);
      });
    } catch (error) {
      const custonError =
        "There was an error retreiving a user from the guest users collection";
      throwError(error, res, custonError);
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

      const updatedGuestAppointment = await getGuestAppointment(
        db,
        guestUserId
      );

      const guestUserWithAppointmentInformation = {
        ...guestUser,
        ...updatedGuestAppointment,
      };

      res.status(201).json(guestUserWithAppointmentInformation);
    } catch (err) {
      throwError(err, res);
    }
  }
);

router.put(
  "/api/auth/guestUsers/:id",
  checkIfGuestIdExists,
  checkIfAppoinmentAlreadyExists,
  checkIfEmailToUpdateExists,
  async (req, res) => {
    const db = await connect();
    const guestUserInfo = req.body;

    try {
      await updateDocumentById(db, "guest_users", req, guestUserInfo).then(
        (user) => {
          if (user.modifiedCount === 1) {
            findOneDocumentById(db, "guest_users", req).then((user) => {
              res.json(user);
            });
          }
        }
      );
    } catch (error) {
      throwError(error, res);
    }
  }
);

router.delete("/api/auth/guestUsers/:id", async (req, res) => {
  const db = await connect();
  try {
    await deleteDocumentById(db, "guest_users", req).then((user) => {
      if (user.deletedCount === 1) {
        res.status(200).json({
          message: "guest user successfully deleted",
        });
      }
    });
  } catch (error) {
    throwError(error, res);
  }
});

export default router;
