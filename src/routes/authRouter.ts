import { Router } from "express";
import passport from "passport";
import "./../passport-config.js";
import { ObjectId } from "mongodb";
import { connect } from "../server.js";
import {
  findOneDocumentById,
  throwError,
} from "../database/globalFunctions.js";

const router = Router();

router.post(
  "/login",
  passport.authenticate("local"),
  async (req: any, res, next) => {
    try {
      findOneDocumentById("registered_users", req.user._id).then((user) => {
        res.json(user);
      });
    } catch (err) {
      throwError(err, res);
    }
  }
);

router.get("/logout", (req, res, next) => {
  if ("passport" in req.session) {
    req.logout((err) => {
      if (err) {
        res.status(500).json({ message: "Logout failed", error: err });
      } else {
        req.session.destroy((err) => {
          if (err) {
            console.error("Error destroying session:", err);
            res
              .status(500)
              .json({ message: "Session destruction failed", error: err });
          } else {
            res.json({ message: "Logout and session destruction successful" });
          }
        });
      }
    });
  } else {
    res.status(400).json({ message: "No active session to logout" });
  }
});

export default router;
