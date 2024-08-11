import mongoose, { Schema } from "mongoose";

interface GalleryTypes {
  user_id: String;
  category: String;
  url: String;
  title: String;
  upload_date: String;
  tags: Array<String>;
}

const galleryschema = new Schema<GalleryTypes>({
  user_id: {
    required: true,
    type: String,
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
  },
  upload_date: {
    type: String,
  },
  tags: {},
});

export const Gallery = mongoose.model<GalleryTypes>("images", galleryschema);
