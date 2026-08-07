import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        name: { type: String, required: true, trim: true },
        link: { type: String, trim: true, default: "" },
        description: { type: String, trim: true, default: "" },
        status: { type: String, enum: ["Planning", "In progress", "Completed"], default: "Planning" },
        progress: { type: Number, min: 0, max: 100, default: 0 },
        tags: { type: [String], default: [] },
        date: { type: String, default: "Today" },
        collaborators: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, joinedAt: { type: Date, default: Date.now } }],
    },
    { timestamps: true }
);

projectSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model("Project", projectSchema);
