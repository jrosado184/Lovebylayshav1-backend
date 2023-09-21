import mongoose, { Schema } from "mongoose";


interface UserTypes {
    first_name: string
    last_name: string
    email:string
    phone_number: number
    date_of_birth: number
    administrative_rights: boolean
}

const registerNewUserSchema= new Schema<UserTypes>({
    first_name: {
        required:true,
        type: String
    },
    last_name: {
        required:true,
        type: String
    },
    email: {
        required:true,
        type: String
    },
    phone_number: {
        required:false,
        type: Number
    },
    date_of_birth: {
        required:false,
        type: Number
    },
    administrative_rights: {
        required:false,
        type: Boolean
    },
})

export const User = mongoose.model<UserTypes>("user", registerNewUserSchema)