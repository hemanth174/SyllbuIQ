import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true, trim: true, maxlength: 500 },
    },
    { timestamps: true },
);

const postSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        content: { type: String, required: true, trim: true, maxlength: 2000 },
        image: { type: String, default: "", maxlength: 5000000 },
        mentions: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, username: String }],
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        comments: { type: [commentSchema], default: [] },
    },
    { timestamps: true },
);

export default mongoose.model("Post", postSchema);
