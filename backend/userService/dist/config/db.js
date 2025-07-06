import mongoose from 'mongoose';
const connectDB = async () => {
    const url = process.env.MONGO_URI;
    if (!url) {
        throw new Error("Mongo URI is not defined in environment variable");
    }
    try {
        await mongoose.connect(url, {
            dbName: "MicroserviceChatApp"
        });
        console.log("MongoDB Connected successfully...");
    }
    catch (err) {
        console.log("MongoDB connection failed!");
        process.exit(1);
    }
};
export default connectDB;
