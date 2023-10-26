import mongoose, { Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";


export interface UserTypes {
  auth0UserId: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string
  phone_number: number;
  date_of_birth: number;
  administrative_rights: boolean;
}
export const registerNewUserSchema = new Schema<UserTypes>({
  auth0UserId: {
    required: true,
    type: String,
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
  password: {
    required: true,
    type: String,
  },
  phone_number: {
    required: false,
    type: Number,
  },
  date_of_birth: {
    required: false,
    type: Number,
  },
  administrative_rights: {
    required: false,
    type: Boolean,
  },
});

registerNewUserSchema.plugin(passportLocalMongoose);

export const User = mongoose.model<UserTypes>("registered_users", registerNewUserSchema);
