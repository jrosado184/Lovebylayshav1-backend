import { Db } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import { updateAppointment } from "../database/appointmentFunctions";

export const uploadImagesToCloud = async (
  db: Db,
  guestUserId: string,
  req: any
) => {
  const { inspirations } = req.body;

  if (inspirations && inspirations.length > 0) {
    for (let i = 0; i < inspirations.length; i++) {
      const image = await cloudinary.uploader.upload(inspirations[i], {
        folder: "inspirations",
      });
      inspirations[i] = { url: image.url, public_id: image.public_id };
    }
    await updateAppointment(db, guestUserId, req);
  }
};

export const removeCloudinaryImage = async (id: string) => {
  await cloudinary.api
    .delete_resources([id], { type: "upload", resource_type: "image" })
    .then(() => {})
    .catch((error) => console.log(error));
};
