import mongoose from "mongoose";

const registerUser = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String, required: true, unique: true
    },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String },
    verifyTokenExpire: { type: Date },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    githubId: {
        type: String
    },
    avatar: {
        type: String
    }
})

export default mongoose.model('User', registerUser)