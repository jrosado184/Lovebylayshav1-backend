import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { connect } from "./server"; // Assuming you have a connect function to establish a database connection
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const db = await connect();
        const collection = db.collection("registered_users");

        const user = await collection.findOne({ email });

        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, String(user._id));
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const db = await connect();
    const collection = db.collection("registered_users");

    const user = await collection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
});
