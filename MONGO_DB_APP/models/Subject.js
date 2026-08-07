import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        done: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const subjectSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        name: { type: String, required: true, trim: true },
        code: { type: String, trim: true, default: "" },
        color: { type: String, default: "bg-emerald-500" },
        semester: { type: String, trim: true, default: "Semester 02 · 2026" },
        topics: { type: [topicSchema], default: [] },
    },
    { timestamps: true }
);

subjectSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model("Subject", subjectSchema);
