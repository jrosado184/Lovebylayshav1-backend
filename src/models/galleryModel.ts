import mongoose, { Schema, Types } from "mongoose";
import { ObjectId } from "mongodb";

interface GalleryTypes {
  user_id: Object;
  category: string;
  url: string;
  title: string;
  upload_date: string;
  tags: string[];
}

const gallerySchema = new Schema<GalleryTypes>(
  {
    user_id: {
      type: ObjectId,
      ref: "registered_users",
      required: true,
    },
    category: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    upload_date: {
      type: String,
    },
    tags: {
      type: [String],
    },
  },
  {
    collection: "gallery",
  }
);

export const Gallery = mongoose.model<GalleryTypes>("gallery", gallerySchema);
