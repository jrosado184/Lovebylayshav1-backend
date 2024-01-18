import { ObjectId } from "mongodb";

//****************** Find ********************/

export const findAllDocuments = async (db: any, collection_name: string) => {
  return await db.collection(collection_name).find().toArray();
};

export const findOneDocumentById = async (
  db: any,
  collection_name: string,
  req: any
) => {
  return await db.collection(collection_name).findOne({
    _id: new ObjectId(req.params.id),
  });
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

//****************** Insert ********************/

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

//****************** Update ********************/

export const updateDocumentById = async (
  db: any,
  collection_name: string,
  req: any,
  value: any
) => {
  return await db.collection(collection_name).updateOne(
    {
      _id: new ObjectId(req.params.id),
    },
    {
      $set: value,
    }
  );
};

//****************** Delete ********************/

export const deleteDocumentById = async (
  db: any,
  collection_name: string,
  req: any
) => {
  return await db.collection(collection_name).deleteOne({
    _id: new ObjectId(req.params.id),
  });
};


//****************** Errors ********************/

export const throwError = (message: any, res:any, custom?: string) => {
  res.status(500).json({
    message: message,
    error: custom
  })
  console.log(message);
}
