import mongoose, { Schema } from "mongoose";

export interface GuestUserTypes {
  auth0UserId: String;
  appointment_id: Array<String> | String;
  first_name: String;
  last_name: String;
  email: String;
  phone_number: Number;
}

const registerNewGuestUserSchema = new Schema<GuestUserTypes>({
  auth0UserId: {
    required: true,
    type: String,
    unique: true,
  },
  appointment_id: {
    required: true,
    type: Array<String>,
    unique: true,
  },
  first_name: {
    required: true,
    type: String,
  },
  last_name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  phone_number: {
    required: true,
    type: Number,
  },
});

export const GuestUser = mongoose.model<GuestUserTypes>(
  "guest_user",
  registerNewGuestUserSchema
);
