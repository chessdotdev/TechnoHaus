import app from './app.js'
import dotenv from 'dotenv';
import connectDB from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT;


const startServer = async () => {

    try {

        await connectDB();
            console.log("MONGO URI:", process.env.MONGODB_URI)

        app.on("error", (error) => {
            throw error;
        });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    } catch (error) {
        console.error("MongoDB connection failed", err);

    }

}



startServer();
