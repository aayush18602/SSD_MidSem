import express from "express";
import { getAllCourses,getAllLectures, createLectureForCourse } from "../controllers/courseController.js"; 
const router = express.Router();

router.get("/courses", getAllCourses);
router.get("/:courseId/lectures", getAllLectures);
router.post("/:courseId/lectures", createLectureForCourse);

export default router;
