import Course from "../models/Courses.js";
import Lecture from "../models/Lectures.js";


export async function getAllCourses(req,res){
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}

export async function getAllLectures(req,res) {
    try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course.lectures); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createLectureForCourse(req, res) {
  try {
    const { courseId } = req.params;
    const { name } = req.body;

    const newLecture = new Lecture({ name, questions: [] });
    await newLecture.save();

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    course.lectures.push(newLecture._id);
    await course.save();

    res.status(201).json(newLecture);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}