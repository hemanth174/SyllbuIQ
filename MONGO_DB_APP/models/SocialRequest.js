import mongoose from "mongoose";

const socialRequestSchema = new mongoose.Schema(
    {
        requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        type: { type: String, enum: ["follow", "collaborate"], required: true },
        project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null },
        status: { type: String, enum: ["pending", "accepted", "rejected", "cancelled"], default: "pending", index: true },
    },
    { timestamps: true },
);

socialRequestSchema.index({ requester: 1, recipient: 1, type: 1, project: 1 }, { unique: true });

export default mongoose.model("SocialRequest", socialRequestSchema);
