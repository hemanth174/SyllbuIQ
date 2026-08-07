import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["follow_request", "follow_accepted", "collaboration_request", "collaboration_accepted", "mention", "comment"], required: true },
        request: { type: mongoose.Schema.Types.ObjectId, ref: "SocialRequest", default: null },
        project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null },
        post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
        message: { type: String, required: true },
        read: { type: Boolean, default: false, index: true },
    },
    { timestamps: true },
);

export default mongoose.model("Notification", notificationSchema);
