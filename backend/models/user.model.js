import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

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
        role:{
            type: String,
            enum: ["admin", "customer"],
            default: "customer"
        },
        fullName: {
            type: String,
            trim: true,
            maxLength: 50
        },
        email: {
            type: String,
            unique: true,
            sparse: true,   // allows multiple null values
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        address: {
            street:   { type: String, trim: true, required: true },
            city:     { type: String, trim: true, required: true },
            province: { type: String, trim: true, required: true },
            zipCode:  { type: String, trim: true, required: true },
            country:  { type: String, trim: true, default: 'Philippines', required: true }
        },

    },
        {
            timestamps: true
        }
)
//hashing password
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

//compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model('User', userSchema)
