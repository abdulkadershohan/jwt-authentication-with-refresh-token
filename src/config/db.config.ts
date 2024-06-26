import mongoose from "mongoose";
// Connect To The Database
const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.DATABASE_URL as string
        );
        console.log("🛢️  Connected To Database");
    } catch (error) {
        console.log("⚠️ Error to connect Database");
    }
}
export default connectDB;