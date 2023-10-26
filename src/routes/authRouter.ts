import { Router } from "express";
import passport from "passport";
import "./../passport-config";
import { ObjectId } from "mongodb";
import { connect } from "../server";

const router = Router();

router.post(
  "/login",
  passport.authenticate("local"),
  async (req, res, next) => {
    res.status(200).json({ message: "Authentication successful" });
    res.redirect("/dashboard")
  }
);

router.get("/dashboard", async (req: any, res) => {
  if (req.isAuthenticated()) {
    const db = await connect();
    const userInformation = await db
      .collection("registered_users")
      .findOne({ _id: new ObjectId(req.user._id) });
    res.json(userInformation);
  } else {
    res.status(401).json({ message: "Unathorized, Please log in" });
  }
});

router.get("/logout", (req, res, next) => {
  if (req.session) {
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
  res.redirect("/login");
});

export default router;
