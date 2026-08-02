import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log(`MongoDB Connected Successfully 🎉`)
    } catch (e) {
        console.error(`MongoDB Connection Error: ${e.message}`);
        process.exit(1)
    }
}
export default connectDB