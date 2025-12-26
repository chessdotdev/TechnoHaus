import { User } from "../models/user.model.js";

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

        res.status(201).json({
            message: "User Registered",
            user: {
                id: user._id,
                username: user.username
            }
        })
        
    } catch (error) {
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

        res.status(200).json({
            message: "User Logged In",
            user : {
                id: user._id,
                username: user.username
            }
        })

    } catch (error) {
        res.status(500).json({ 
            message: "Internal Server Error", error: error.message 
        });   

    }
}


const logoutUser = async (req, res)=>{

    try {
        const { username } = req.body;

        const user = await User.findOne({username: username})
    
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
    
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