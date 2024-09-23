import mongoose, { Schema } from "mongoose";
import { ObjectId } from "mongodb";

export interface TechTypes {
  tech_id: String;
  tech_name: String;
  tech_email: String;
  tech_phone_number: String;
  tech_avatar: String;
  tech_profession: String;
  tech_appointments: Array<String>;
}

const registerNewTechSchema = new Schema<TechTypes>({
  tech_id: {
    unique: true,
    type: ObjectId,
    required: true,
  },
  tech_name: {
    required: true,
    type: String,
  },
  tech_email: {
    required: true,
    type: String,
  },
  tech_phone_number: {
    required: true,
    type: String,
  },
  tech_avatar: {
    required: true,
    type: String,
  },
  tech_profession: {
    require: true,
    type: String,
  },
  tech_appointments: {},
});

export const Tech = mongoose.model<TechTypes>("techs", registerNewTechSchema);
