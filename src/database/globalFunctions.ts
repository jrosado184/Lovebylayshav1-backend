import { ObjectId } from "mongodb";
import { connect } from "../server.js";
import { Request, Response } from "express";

//****************** Find ********************/

export const findAllDocuments = async (collection_name: string) => {
  const db = await connect();
  return await db.collection(collection_name).find().toArray();
};

export const findOneDocumentById = async (collection_name: string, id: any) => {
  const db = await connect();
  return await db.collection(collection_name).findOne({
    _id: new ObjectId(id),
  });
};

export const findDocumentWithEmailOrPhoneNumber = async (
  collection_name: string,
  value1: string,
  value2: string
) => {
  const db = await connect();
  return await db
    .collection(collection_name)
    .find({
      $or: [{ email: value1 }, { phone_number: value2 }],
    })
    .toArray();
};

//****************** Insert ********************/

export const insertIntoDatabase = async (
  collection_name: string,
  document: any
) => {
  const db = await connect();
  return await db.collection(collection_name).insertOne(document);
};

export const addGuestUserIdToAppointment = async (
  collection_name: string,
  document: any,
  res: Response
) => {
  const db = await connect();
  return await db.collection(collection_name).updateOne(
    { _id: new ObjectId(document.insertedId.toString()) },
    {
      $set: { user_id: new ObjectId(res.locals.guestUserId) },
    }
  );
};

//****************** Update ********************/

export const updateDocumentById = async (
  collection_name: string,
  value: any,
  req: Request
) => {
  const db = await connect();
  return await db.collection(collection_name).updateOne(
    {
      _id: new ObjectId(req.params.id),
    },
    {
      $set: value,
    }
  );
};

export const updateDocumentAndPushById = async (
  collection_name: string,
  value: any,
  req?: Request,
  id?: string
) => {
  const db = await connect();
  return await db.collection(collection_name).updateOne(
    {
      _id: new ObjectId(req?.params.id ?? id),
    },
    {
      $push: value,
    }
  );
};

//****************** Delete ********************/

export const deleteDocumentById = async (collection_name: string, id: any) => {
  const db = await connect();
  return await db.collection(collection_name).deleteOne({
    _id: new ObjectId(id),
  });
};

//****************** Errors ********************/

export const throwError = (message: any, res: Response, custom?: string) => {
  res.status(500).json({
    message: message,
    error: custom,
  });
  console.log(message);
};
