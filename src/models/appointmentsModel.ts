import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

export interface AppointmentTypes {
  appointment_id: String;
  user_id: Object,
    year: Number;
    month: Number;
    day: Number;
    time: String;
    services: {
      nails: {
        fullSet: Boolean;
        refill: Boolean;
        shape: String;
        length: String;
        design: String;
        extras: String[];
      };
      pedicure: Boolean;
      addons: String;
    };
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
    services: {
      nails: {
        fullSet: {
          type: Boolean,
        },
        refill: {
          type: Boolean,
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
        extras: {
          type: Array<String>,
        },
      },
      pedicure: {
        type: String,
      },
      addons: {
        type: String,
      },
  },
});

export const Appointment = mongoose.model<AppointmentTypes>("appointment", appointmentSchema)
