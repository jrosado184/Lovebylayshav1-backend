import { ObjectId } from "mongodb";
import { getGuestAppointment } from "./guestsFunctions";

export const updateAppointmentInspirationsURL = async (
  db: any,
  guestUserId: string,
  req: any
) => {
  await db
    .collection("appointments")
    .updateOne(
      { user_id: new ObjectId(guestUserId) },
      { $set: { inspirations: req?.body?.inspirations } }
    );
  return getGuestAppointment(db, guestUserId);
};
