import { User } from "../models/user.model.js";


const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
    
  };


export {
    getProfile
}