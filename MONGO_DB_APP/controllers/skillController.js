import Skill from "../models/Skill.js";
import Project from "../models/Project.js";
import { broadcastToUser } from "../realtime.js";

export const getSkills = async (req, res) => {
    try {
        const projectNames = await Project.find({ user: req.user.id }).distinct("name");
        await Skill.updateMany(
            { user: req.user.id, $or: [{ projectId: null }, { projectId: { $exists: false } }] },
            { $set: { project: "", projectId: null } },
        );
        const skills = await Skill.find({ user: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json(skills);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createSkill = async (req, res) => {
    try {
        const { name, completion, project = "", projectId = null } = req.body;
        const normalizedName = String(name || "").trim();
        const parsedCompletion = Number(completion);

        if (!normalizedName || !Number.isFinite(parsedCompletion) || parsedCompletion < 0 || parsedCompletion > 100) {
            return res.status(400).json({ message: "A skill name and completion between 0 and 100 are required" });
        }

        const normalizedProject = String(project || "").trim();
        const validProject = projectId ? await Project.findOne({ _id: projectId, user: req.user.id }) : null;
        if (normalizedProject && !validProject) {
            return res.status(400).json({ message: "Choose a project from your projects list" });
        }

        const skill = await Skill.create({
            user: req.user.id,
            name: normalizedName,
            completion: parsedCompletion,
            project: normalizedProject,
            projectId: validProject?._id || null,
        });

        broadcastToUser(req.user.id, { type: "skills:changed" });
        broadcastToUser(req.user.id, { type: "projects:changed" });
        return res.status(201).json(skill);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "You have already added this skill" });
        }
        return res.status(500).json({ message: error.message });
    }
};

export const updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findOne({ _id: req.params.id, user: req.user.id });
        if (!skill) return res.status(404).json({ message: "Skill not found" });
        const { name, completion, project, projectId } = req.body;
        if (name !== undefined) skill.name = String(name).trim();
        if (completion !== undefined) skill.completion = Number(completion);
        if (project !== undefined) {
            const normalizedProject = String(project || "").trim();
            const validProject = projectId ? await Project.findOne({ _id: projectId, user: req.user.id }) : null;
            if (normalizedProject && !validProject) {
                return res.status(400).json({ message: "Choose a project from your projects list" });
            }
            skill.project = normalizedProject;
            skill.projectId = validProject?._id || null;
        }
        await skill.save();
        broadcastToUser(req.user.id, { type: "skills:changed" });
        broadcastToUser(req.user.id, { type: "projects:changed" });
        return res.status(200).json(skill);
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: "You have already added this skill" });
        return res.status(500).json({ message: error.message });
    }
};
