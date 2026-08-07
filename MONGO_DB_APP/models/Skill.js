import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        name: { type: String, required: true, trim: true },
        completion: { type: Number, required: true, min: 0, max: 100 },
        project: { type: String, trim: true, default: "" },
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null },
    },
    { timestamps: true }
);

skillSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model("Skill", skillSchema);
