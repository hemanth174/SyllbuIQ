import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import { createSkill, getSkills, updateSkill } from "../controllers/skillController.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getSkills);
router.post("/", createSkill);
router.patch("/:id", updateSkill);

export default router;
