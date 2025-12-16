import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minLength: 1,
            maxLength: 10
        },
        password:{
            type: String,
            required: true,
            minLength: 6,
            maxLength: 30
        },

    },
        {
            timestamps: true
        }
)