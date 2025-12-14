import mongoose, { Schema } from "mongoose";


const productsSchema = new Schema(
    {
        CPU:{
            type: String,
            trim: true
        },

        GPU:{
            type: String,
            trim: true
        },
        RAM:{
            type: String,
            trim: true
        },
        MOTHERBOARD:{
            type: String,
            trim: true
        },
        STORAGE:{
            type: String,
            trim: true
        },
        PSU:{
            type: String,
            trim: true
        },
        CASE:{
            type: String,
            trim: true
        }
    }
)

export const Products = mongoose.model('Products', productsSchema)