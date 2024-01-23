import mongoose, { Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface UserTypes {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: number;
  date_of_birth: number;
  appointments: {
    upcoming: Array<string>;
    past: [];
  };
  createdAt: Date;
  updatedAt: Date;
  administrative_rights: boolean;
}
export const registerNewUserSchema = new Schema<UserTypes>({
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
  appointments: {
    upcoming: {
      type: Array<String>,
    },
    past: {
      type: Array<String>,
    },
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  administrative_rights: {
    required: false,
    type: Boolean,
  },
});

registerNewUserSchema.plugin(passportLocalMongoose);

export const User = mongoose.model<UserTypes>(
  "registered_users",
  registerNewUserSchema
);
