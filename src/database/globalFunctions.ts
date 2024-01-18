import {  ObjectId } from "mongodb";

export const insertIntoDatabase = async (
  db: any,
  collection_name: string,
  document: any
) => {
 return await db.collection(collection_name).insertOne(document);
};

export const addGuestUserIdToAppointment = async (
  db: any,
  collection_name: string,
  document: any,
  res: any
) => {
 return await db.collection(collection_name).updateOne(
    { _id: new ObjectId(document.insertedId.toString()) },
    {
      $set: { user_id: new ObjectId(res.locals.guestUserId) },
    }
  );
};

export const findDocumentWithEmailOrPhoneNumber = async (
  db: any,
  collection_name: string,
  value1: string,
  value2: string
) => {
  return await db
    .collection(collection_name)
    .find({
      $or: [{ email: value1 }, { phone_number: value2 }],
    })
    .toArray();
};
