import Course from "../models/Courses.js";
import Lecture from "../models/Lectures.js";
import User from "../models/User.js";


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
export async function deleteLectureFromCourse(req, res) {
  try {
    const { courseId, lectureId } = req.params;

    // Step 1: Remove lecture document
    const deletedLecture = await Lecture.findByIdAndDelete(lectureId);
    if (!deletedLecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    // Step 2: Remove reference from the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    course.lectures = course.lectures.filter(
      (lecId) => lecId.toString() !== lectureId
    );
    await course.save();

    res.json({ message: "Lecture deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCoursesById(req,res) {
  const { userId } = req.params;

  const user = await User.findById(userId).populate("courses");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const coursesWithInstructor = await Promise.all(
      user.courses.map(async (course) => {
        const instructor = await User.findOne({
          role: "instructor",
          courses: course._id
        }).select("fname lname email");

        return {
          ...course.toObject(),
          instructor: instructor ? instructor.toObject() : null
        };
      })
    );

    return res.status(201).json(coursesWithInstructor);
}