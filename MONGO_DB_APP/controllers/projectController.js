import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import { broadcastToUser } from "../realtime.js";

const withLinkedSkills = async (projects, userId) => {
    const skills = await Skill.find({ user: userId, projectId: { $ne: null } }).select("name project projectId").lean();
    return projects.map((project) => ({
        ...project.toObject(),
        linkedSkills: skills.filter((skill) => String(skill.projectId) === String(project._id)).map((skill) => skill.name),
    }));
};

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ $or: [{ user: req.user.id }, { "collaborators.user": req.user.id }] }).sort({ createdAt: -1 });
        return res.status(200).json(await withLinkedSkills(projects, req.user.id));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createProject = async (req, res) => {
    try {
        const { name, link = "", description = "", status = "Planning", progress = 0, tags = [] } = req.body;
        const normalizedName = String(name || "").trim();
        if (!normalizedName) return res.status(400).json({ message: "Project name is required" });

        const project = await Project.create({
            user: req.user.id,
            name: normalizedName,
            link: String(link || "").trim(),
            description: String(description || "").trim(),
            status,
            progress: Number(progress),
            tags: Array.isArray(tags) ? tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
            date: "Today",
        });
        const response = (await withLinkedSkills([project], req.user.id))[0];
        broadcastToUser(req.user.id, { type: "projects:changed" });
        return res.status(201).json(response);
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: "You have already added this project" });
        return res.status(500).json({ message: error.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, $or: [{ user: req.user.id }, { "collaborators.user": req.user.id }] });
        if (!project) return res.status(404).json({ message: "Project not found" });
        const previousName = project.name;
        const isOwner = String(project.user) === String(req.user.id);
        const { name, link, description, status, progress, tags } = req.body;
        if (name !== undefined && isOwner) project.name = String(name).trim();
        if (link !== undefined && isOwner) project.link = String(link || "").trim();
        if (description !== undefined && isOwner) project.description = String(description).trim();
        if (status !== undefined && isOwner) project.status = status;
        if (progress !== undefined) project.progress = Number(progress);
        if (tags !== undefined && isOwner) project.tags = Array.isArray(tags) ? tags.map((tag) => String(tag).trim()).filter(Boolean) : [];
        await project.save();
        if (previousName !== project.name) await Skill.updateMany({ user: req.user.id, projectId: project._id }, { $set: { project: project.name } });
        const response = (await withLinkedSkills([project], req.user.id))[0];
        broadcastToUser(req.user.id, { type: "projects:changed" });
        broadcastToUser(req.user.id, { type: "skills:changed" });
        return res.status(200).json(response);
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: "You have already added this project" });
        return res.status(500).json({ message: error.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!project) return res.status(404).json({ message: "Project not found" });
        await Skill.updateMany({ user: req.user.id, projectId: project._id }, { $set: { project: "", projectId: null } });
        broadcastToUser(req.user.id, { type: "projects:changed" });
        broadcastToUser(req.user.id, { type: "skills:changed" });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
