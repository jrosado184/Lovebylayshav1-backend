import mongoose, { Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface UserTypes {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: number;
  date_of_birth: number;
  avatar: string;
  appointments: {
    upcoming: Array<string>;
    past: [];
  };
  createdAt: Date;
  updatedAt: Date;
  role: string;
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
  avatar: {},
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
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user",
  },
});

registerNewUserSchema.plugin(passportLocalMongoose);

export const User = mongoose.model<UserTypes>(
  "registered_users",
  registerNewUserSchema
);
