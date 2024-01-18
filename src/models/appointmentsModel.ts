import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

export interface AppointmentTypes {
  appointment_id: String;
  user_id: Object;
  confirmation_code: String;
  year: Number;
  month: Number;
  day: Number;
  time: String;
  service: String;
  shape: String;
  length: String;
  design: String;
  extras: Array<String>;
  pedicure: String;
  inspirations: Array<String>;
}

const appointmentSchema = new Schema<AppointmentTypes>({
  appointment_id: {
    required: true,
    type: String,
    unique: true,
  },
  user_id: {
    required: true,
    type: ObjectId,
    unique: true,
  },
  confirmation_code: {
    required: true,
    type: String,
    unique: true,
  },
  year: {
    required: true,
    type: Number,
  },
  month: {
    required: true,
    type: Number,
  },
  day: {
    required: true,
    type: Number,
  },
  time: {
    required: true,
    type: String,
  },
  service: {
    type: String,
  },
  shape: {
    type: String,
  },
  length: {
    type: String,
  },
  design: {
    type: String,
  },
  extras: {},
  pedicure: {
    type: String,
  },
  inspirations: {},
});

export const Appointment = mongoose.model<AppointmentTypes>(
  "appointment",
  appointmentSchema
);
