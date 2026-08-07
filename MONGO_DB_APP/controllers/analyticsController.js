import Project from "../models/Project.js";
import Skill from "../models/Skill.js";

export const getAnalytics = async (req, res) => {
    try {
        const [projects, skills] = await Promise.all([
            Project.find({ user: req.user.id }).sort({ createdAt: -1 }).lean(),
            Skill.find({ user: req.user.id }).sort({ createdAt: -1 }).lean(),
        ]);

        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const activity = Array.from({ length: 7 }, (_, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (6 - index));
            const key = date.toISOString().slice(0, 10);
            const events = [...projects, ...skills].filter((item) => item.createdAt?.toISOString().slice(0, 10) === key).length;
            return { key, label: date.toLocaleDateString("en-US", { weekday: "short" }), events };
        });

        const totalCompletion = skills.reduce((total, skill) => total + skill.completion, 0);
        return res.status(200).json({
            summary: {
                skills: skills.length,
                projects: projects.length,
                linkedSkills: skills.filter((skill) => skill.projectId).length,
                averageSkillCompletion: skills.length ? Math.round(totalCompletion / skills.length) : 0,
                averageProjectProgress: projects.length ? Math.round(projects.reduce((total, project) => total + project.progress, 0) / projects.length) : 0,
            },
            activity,
            skills: skills.slice(0, 8).map(({ _id, name, completion, project }) => ({ _id, name, completion, project })),
            projects: projects.slice(0, 8).map(({ _id, name, progress, status }) => ({ _id, name, progress, status })),
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
