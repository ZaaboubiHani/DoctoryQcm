const Year = require("../models/year");
const Module = require("../models/module");
const Course = require("../models/course");
const Question = require("../models/question");

const createYear = async (req, res) => {
  try {
    const newYear = new Year({
      name: req.body.name,
    });

    const createdYear = await newYear.save();

    res.status(201).json({ data: createdYear, success: true });
  } catch (error) {
    res.status(500).json({ error: "Error creating Year" });
  }
};

const updateYear = async (req, res) => {
  const yearId = req.params.id;
  try {
    const updatedYear = await Year.findByIdAndUpdate(
      yearId,
      req.body,
      { new: true }
    );

    if (!updatedYear) {
      return res.status(404).json({ error: "Year not found" });
    }

    res.status(200).json({ data: updatedYear, success: true });
  } catch (error) {
    res.status(500).json({ error: "Error updating Year" });
  }
};
const deleteYear = async (req, res) => {
  const yearId = req.params.id;

  try {
    const deletedYear = await Year.findByIdAndDelete(yearId);

    if (!deletedYear) {
      return res.status(404).json({ error: "Year not found" });
    }

    // Remove this yearId from all Courses
    await Course.updateMany(
      { yearIds: yearId },
      { $pull: { yearIds: yearId } }
    );

    // Remove this yearId from all Modules
    await Module.updateMany(
      { yearIds: yearId },
      { $pull: { yearIds: yearId } }
    );

    // Remove this yearId from Users (set to null)
    await User.updateMany(
      { yearId: yearId },
      { $set: { yearId: null } }
    );

    res.status(200).json({
      success: true,
      message: "Year deleted and references removed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting Year" });
  }
};

const getYears = async (req, res) => {
  try {
    const years = await Year.find();
    res.status(200).json({ data: years, success: true });
  } catch (error) {
    res.status(500).json({ error: "Error fetching Years" });
  }
};

module.exports = {
  createYear,
  updateYear,
  deleteYear,
  getYears,
};
