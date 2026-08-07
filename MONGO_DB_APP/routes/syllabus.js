import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createSubject, deleteSubject, getSubjects, updateSubject } from "../controllers/syllabusController.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getSubjects);
router.post("/", createSubject);
router.patch("/:id", updateSubject);
router.delete("/:id", deleteSubject);

export default router;