import Subject from "../models/Subject.js";
import { broadcastToUser } from "../realtime.js";

export const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ user: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json(subjects);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createSubject = async (req, res) => {
    try {
        const { name, code = "", color = "bg-emerald-500", semester = "Semester 02 · 2026" } = req.body;
        const normalizedName = String(name || "").trim();
        if (!normalizedName) return res.status(400).json({ message: "Subject name is required" });

        const subject = await Subject.create({
            user: req.user.id,
            name: normalizedName,
            code: String(code || "").trim(),
            color: String(color || "bg-emerald-500").trim(),
            semester: String(semester || "Semester 02 · 2026").trim(),
        });

        broadcastToUser(req.user.id, { type: "syllabus:changed" });
        return res.status(201).json(subject);
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: "You have already added this subject" });
        return res.status(500).json({ message: error.message });
    }
};

export const updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findOne({ _id: req.params.id, user: req.user.id });
        if (!subject) return res.status(404).json({ message: "Subject not found" });
        const { name, code, color, semester, topics } = req.body;
        if (name !== undefined) subject.name = String(name).trim();
        if (code !== undefined) subject.code = String(code || "").trim();
        if (color !== undefined) subject.color = String(color).trim();
        if (semester !== undefined) subject.semester = String(semester || "").trim();
        if (topics !== undefined) {
            subject.topics = Array.isArray(topics)
                ? topics
                      .map((topic) => {
                          if (typeof topic === "object" && topic) {
                              return { name: String(topic.name || "").trim(), done: Boolean(topic.done) };
                          }
                          return { name: String(topic || "").trim(), done: false };
                      })
                      .filter((topic) => topic.name)
                : subject.topics;
        }
        await subject.save();
        broadcastToUser(req.user.id, { type: "syllabus:changed" });
        return res.status(200).json(subject);
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: "You have already added this subject" });
        return res.status(500).json({ message: error.message });
    }
};

export const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!subject) return res.status(404).json({ message: "Subject not found" });
        broadcastToUser(req.user.id, { type: "syllabus:changed" });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};