import { Db, ObjectId } from "mongodb";
import { GuestUser } from "../models/guestUsersModel";
import { insertIntoDatabase } from "./globalFunctions";

export const getGuestUser = (db: Db, guestUserId: string) => {
  return db
    .collection("guest_users")
    .findOne(
      { _id: new ObjectId(guestUserId) },
      { projection: { appointment_id: 0 } }
    );
};

export const getGuestAppointment = (db: Db, guestUserId: string) => {
  return db
    .collection("appointments")
    .findOne({ user_id: new ObjectId(guestUserId) });
};

export const addNewGuestUser = async (db: Db, req: any, appointment: any) => {
  const newGuestUserSchema = new GuestUser({
    appointment_id: new ObjectId(appointment.insertedId.toString()),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    phone_number: req.body.phone_number,
  });

  const newGuestUser: any = await insertIntoDatabase(
    db,
    "guest_users",
    newGuestUserSchema
  );

  return newGuestUser;
};

export const addAppointmentIdToGuestUser = async (
  db: any,
  existingGuestUsers: any,
  addAppointment: any
) => {
  return await db.collection("guest_users").updateOne(
    { _id: new ObjectId(existingGuestUsers[0]._id.toString()) },
    {
      $push: {
        appointment_id: new ObjectId(addAppointment.insertedId.toString()),
      },
    }
  );
};


