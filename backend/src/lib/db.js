import mongoose from "mongoose";

export const connect_db = async () => {
    try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDb connected : ${conn.connection.host} `);
    } catch (error) {
        console.log("MongoDb connection error" , error);
    }
}