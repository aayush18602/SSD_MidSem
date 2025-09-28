import express from "express";
import { getAllCourses,getAllLectures, createLectureForCourse, deleteLectureFromCourse, getCoursesById } from "../controllers/courseController.js"; 
import {protect} from '../middleware/authMiddleware.js'
const router = express.Router();

router.get("/courses", getAllCourses);
router.get("/courses/:userId",protect, getCoursesById);
router.get("/:courseId/lectures", protect, getAllLectures);
router.post("/:courseId/lectures", protect, createLectureForCourse);
router.delete("/:courseId/lectures/:lectureId", protect, deleteLectureFromCourse);

export default router;
