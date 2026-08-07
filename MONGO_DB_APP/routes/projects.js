import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import { createProject, deleteProject, getProjects, updateProject } from "../controllers/projectController.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getProjects);
router.post("/", createProject);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
