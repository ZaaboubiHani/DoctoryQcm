const Course = require("../models/course");

const createCourse = async (req, res) => {
  try {
    const newCourse = new Course({
      ...req.body,
    });

    const createdCourse = await newCourse.save();

    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ error: "Error creating Course" });
  }
};
const updateCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, {
      new: true,
    });

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: "Error updating Course" });
  }
};
const deleteCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting Course" });
  }
};

const getCourses = async (req, res) => {
  try {
    const moduleId = req.query.module;

    // changed params to query
    if (!moduleId) {
      return res.status(400).json({ error: "Module not provided" });
    }
    const courses = await Course.find({ module: moduleId });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Course" });
  }
};

const getCoursesV2 = async (req, res) => {
  try {
    const moduleId = req.query.module;

    if (!moduleId) {
      return res.status(400).json({ error: "Module not provided" });
    }
    const courses = await Course.find({ module: moduleId });
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ error: "Error fetching Course" });
  }
};

const getCoursesByName = async (req, res) => {
  try {
    console.log("get courses");
    const courseName = req.query.name;
    if (!courseName) {
      return res.status(400).json({ error: "Course name not provided" });
    }

    // Use a case-insensitive search for the course name
    const courses = await Course.find({
      name: { $regex: new RegExp(courseName, "i") },
    });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Course" });
  }
};

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  getCoursesByName,
  getCoursesV2,
};
