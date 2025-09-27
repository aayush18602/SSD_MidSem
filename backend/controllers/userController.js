import User from "../models/User.js";
import Course from "../models/Courses.js";

export async function getAllUsers(req, res) {
  try {
    const users = await User.find().populate("courses");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createUser(req, res) {
  try {
    const { fname, lname, email, password, role, courseIds } = req.body;

    if (!fname || !lname || !email || !password) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    let courses = [];
    if (courseIds && courseIds.length > 0) {
      courses = await Course.find({ _id: { $in: courseIds } });
      if (courses.length !== courseIds.length) {
        return res.status(400).json({ error: "Some course IDs are invalid" });
      }
    }

    const newUser = new User({
      fname,
      lname,
      email,
      password, 
      role: role,
      courses: courseIds || [],
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        fname: newUser.fname,
        lname: newUser.lname,
        email: newUser.email,
        role: newUser.role,
        courses: newUser.courses,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
