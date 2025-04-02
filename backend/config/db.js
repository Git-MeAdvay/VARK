import mongoose from 'mongoose';

export const connectDB = async () => {

    const url = process.env.MONGO_URI || 'mongodb://localhost:27017/api';

    try {
        const conn = await mongoose.connect(url);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch(error) {
        console.error(error);
        process.exit(1);
    }
}