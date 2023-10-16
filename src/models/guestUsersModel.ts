import mongoose, { Schema } from "mongoose";

export interface GuestUserTypes {
  auth0UserId: String;
  appointment_id: string | Number,
  first_name: String;
  last_name: String;
  email: String;
  phone_number: Number;
  // appointment: {
  //   year: Number;
  //   month: Number;
  //   day: Number;
  //   time: String;
  //   services: {
  //     nails: {
  //       fullSet: Boolean;
  //       refill: Boolean;
  //       shape: String;
  //       length: String;
  //       design: String;
  //       extras: Array<String>;
  //     };
  //     pedicure: String;
  //     addons: String;
  //   };
  // };
}

const registerNewGuestUserSchema = new Schema<GuestUserTypes>({
  auth0UserId: {
    required: true,
    type: String,
    unique: true,
  },
  appointment_id: {
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
  phone_number: {
    required: true,
    type: Number,
  },
  // appointment: {
  //   year: {
  //     required: true,
  //     type: Number,
  //   },
  //   month: {
  //     required: true,
  //     type: Number,
  //   },
  //   day: {
  //     required: true,
  //     type: Number,
  //   },
  //   time: {
  //     required: true,
  //     type: String,
  //   },
  //   services: {
  //     nails: {
  //       fullSet: {
  //         type: Boolean,
  //       },
  //       refill: {
  //         type: Boolean,
  //       },
  //       shape: {
  //         type: String,
  //       },
  //       length: {
  //         type: String,
  //       },
  //       design: {
  //         type: String,
  //       },
  //       extras: {
  //         type: Array<String>,
  //       },
  //     },
  //     pedicure: {
  //       type: String,
  //     },
  //     addons: {
  //       type: String,
  //     },
  //   },
  // },
});

export const GuestUser = mongoose.model<GuestUserTypes>(
  "guest_user",
  registerNewGuestUserSchema
);
