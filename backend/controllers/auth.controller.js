import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
// import crypto from 'crypto';
// // Generate a random 64-byte string and convert it to hexadecimal
// const secret = crypto.randomBytes(64).toString('hex');
// console.log('Generated Secret:', secret);


const createUser = async (req, res)=>{

    try {
        const {username, password} = req.body;

        if(!username || !password){
            return res.status(400).json({
                message: "All field are required"
            })
        }
    
        const existing = await User.findOne({username: username});
    
        if(existing){
            return res.status(400).json({
                message: "Username is already exist"
            })
        }
    
        const user = await User.create({
            username,
            password,
            loggedIn: false
        })

        const token = jwt.sign({userId: user._id, username: username, role: user.role}, process.env.JWT_SECRET,{
            expiresIn: '1h',
        })

        res.cookie('jwt', token, {
            maxAge:  60 * 60 * 1000, 
            httpOnly: true
        })
            console.log("User Register");
            
        res.status(201).json({
            message: "User Registered",
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        })
        
    } catch (error) {
        console.error("Register Error:", error);

        res.status(500).json({ 
            message: "Internal Server Error", error: error.message 
        });   
    }
}

const loginUser = async (req, res)=>{
    try {
        
        const { username, password } = req.body;

        const user = await User.findOne({username: username})
     
        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }   

        const token = jwt.sign({userId: user._id, username: username, role: user.role}, process.env.JWT_SECRET,{
            expiresIn: '1h',
        })

        res.cookie("jwt", token, {
            maxAge: 60 * 60 * 1000,  // Expires in 1 hour
            httpOnly: true
        })

        console.log('Generated Token:', token);
        res.status(200).json({
            message: "User Logged In",
            user : {
                id: user._id,
                username: user.username,
                role: user.role
            },
            token
        })

    } catch (error) {
        res.status(500).json({ 
            message: "Internal Server Error", error: error.message 
        });   

    }
}


const logoutUser = async (req, res)=>{
   
    try {
      
      res.clearCookie('jwt',  {
        httpOnly: true,
        sameSite: 'Strict',
        secure: true
      })
      
      console.log("Logout Successfull");
        res.status(200).json({
            message: "Logout Successfull"
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
   
}

export {
    createUser,
    loginUser,
    logoutUser
}