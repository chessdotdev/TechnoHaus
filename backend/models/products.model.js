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
        STORAGE:{
            type: String,
            trim: true
        },
        CASE:{
            type: String,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
          },
        image: { 
            type: String,
            required: true 
        },
        category: {
            type: String,
            enum: ["PC Build", "Peripheral", "Monitor", "Component"],
            default: "PC Build"
        },
        name: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        brand:{
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
)

export const Products = mongoose.model('Products', productsSchema)