import { ObjectId } from "mongodb";
import { getGuestAppointment } from "./guestsFunctions.js";
import { connect } from "../server.js";

//****************** Cloudinary ********************/
export const updateAppointmentInspirationsURL = async (
  guestUserId: string,
  req: any
) => {
  const db = await connect();
  await db
    .collection("appointments")
    .updateOne(
      { user_id: new ObjectId(guestUserId) },
      { $set: { inspirations: req?.body?.inspirations } }
    );
  return getGuestAppointment(guestUserId);
};

//****************** Update ********************/

// adds appointment id to registered user's upcoming appointments

export const addAppointmentIdToRegisteredUser = async (
  addedAppointment: any,
  req: any
) => {
  const db = await connect();
  return await db.collection("registered_users").updateOne(
    { _id: new ObjectId(req.body.user_id) },
    {
      $push: {
        "appointments.upcoming": addedAppointment.insertedId,
      },
    }
  );
};
