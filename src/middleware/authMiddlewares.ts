import { NextFunction } from "express";

export const authenticate = (req: any, res: any, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};
