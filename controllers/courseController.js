const fs = require("fs");
const path = require("path");
const File = require("../models/file"); // Adjust the path to your File model
const Course = require("../models/course");
const mongoose = require("mongoose");

const createCourse = async (req, res) => {
  try {
    const { module: moduleId } = req.body;

    // Make sure the module ID is provided
    if (!moduleId) {
      return res.status(400).json({ error: "Module ID is required" });
    }

    // Find the highest index within this module
    const lastCourse = await Course.findOne()
      .sort({ index: -1 })
      .limit(1);

    const nextIndex = lastCourse ? lastCourse.index + 1 : 1;

    const newCourse = new Course({
      ...req.body,
      index: nextIndex,
    });

    let createdCourse = await newCourse.save();

    // ✅ Populate file only if it exists
    if (req.body.file) {
      createdCourse = await createdCourse.populate("file");
    }

    res.status(201).json({ success: true, data: createdCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating Course" });
  }
};

const updateCourse = async (req, res) => {
  const courseId = req.params.id;

  try {
    const years = req.body.years.map((year) => {
      if (year == '692ac3009b0bb7926894ee02') {
        return "Residency";
      }
      if (year == '692ac43c9b0bb7926894ee1c') {
        return "Fourth";
      }
      if (year == '692ac4469b0bb7926894ee1e') {
        return "Fifth";
      }
      if (year == '692ac4509b0bb7926894ee20') {
        return "Sixth";
      }
      if (year == '692ad748b495dbbf7d594457') {
        return "Constantine";
      }
      return year;
    });

    const yearIds = req.body.years;
    const updatedCourse = await Course.findByIdAndUpdate(courseId, {
      ...req.body,
      years,
      yearIds,
    }, {
      new: true,
    }).populate("file"); // ✅ Populate the file field if it exists

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json({ success: true, data: updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating Course" });
  }
};

const deletePath = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err && err.code !== "ENOENT")
        reject(err); // Ignore "file not found" errors
      else resolve();
    });
  });
};

const deleteCourse = async (req, res) => {
  const courseId = req.params.id;

  try {
    // ✅ Find the course first
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // ✅ Delete the associated file if it exists
    if (course.file) {
      const file = await File.findById(course.file);
      if (file) {
        const baseUrl = process.env.BASE_URL;
        const filePath = file.url.replace(baseUrl, ""); // Get the file path
        await deletePath(path.join(__dirname, "../", filePath)); // Delete from directory
        await File.findByIdAndDelete(file._id); // Delete from DB
      }
    }

    // ✅ Now delete the course
    await Course.findByIdAndDelete(courseId);

    res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
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
    const year = req.query.year;
    let query = {};
    if (year) {
      switch (year) {
        case '692ac3009b0bb7926894ee02':
          query.years = { $in: ["Residency"] };
          break;
        case '692ac43c9b0bb7926894ee1c':
          query.years = { $in: ["Fourth"] };
          break;
        case '692ac4469b0bb7926894ee1e':
          query.years = { $in: ["Fifth"] };
          break;
        case '692ac4509b0bb7926894ee20':
          query.years = { $in: ["Sixth"] };
          break;
        case '692ad748b495dbbf7d594457':
          query.years = { $in: ["Constantine"] };
          break;

        default:
          query.years = { $in: [year] };
          break;
      }
    }

    // if (year) {
    //   // query.yearIds = { $in: [new mongoose.Types.ObjectId(year.trim())] };
    //   query.years = { $in: [year] };
    // }

    if (!moduleId) {
      return res.status(400).json({ error: "Module not provided" });
    }
    query.module = moduleId;

    const courses = await Course.find(query)
      .populate("file")
      .sort({ index: 1 })
      .exec();

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ error: "Error fetching Course" });
  }
};

const getCoursesByName = async (req, res) => {
  try {
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


const reorderCourses = async (req, res) => {
  try {
    const coursesOrder = req.body;

    if (!Array.isArray(coursesOrder)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload format",
      });
    }

    const bulkOps = coursesOrder.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { index: item.index } },
      },
    }));

    await Course.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: "Courses reordered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Error reordering courses",
    });
  }
};

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  getCoursesByName,
  getCoursesV2,
  reorderCourses,
};
