const Module = require("../models/module");
const mongoose = require("mongoose");

const createModule = async (req, res) => {
  try {
    // Get the module with the highest index
    const lastModule = await Module.findOne().sort({ index: -1 }).limit(1);

    const nextIndex = lastModule ? lastModule.index + 1 : 1; // start from 1 if no modules exist

    const newModule = new Module({
      ...req.body,
      index: nextIndex,
    });

    const createdModule = await newModule.save();

    res.status(201).json({ success: true, data: createdModule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating Module" });
  }
};

const updateModule = async (req, res) => {
  const moduleId = req.params.id;
  try {
    const updatedModule = await Module.findByIdAndUpdate(moduleId, req.body, {
      new: true,
    });

    if (!updatedModule) {
      return res.status(404).json({ error: "Module not found" });
    }

    res.status(200).json({ success: true, data: updatedModule });
  } catch (error) {
    res.status(500).json({ error: "Error updating Category" });
  }
};

const deleteModule = async (req, res) => {
  const moduleId = req.params.id;
  try {
    const deletedModule = await Module.findByIdAndDelete(moduleId);

    if (!deletedModule) {
      return res.status(404).json({ error: "Module not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Module deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting Module" });
  }
};

const getModules = async (req, res) => {
  try {
    const categoryId = req.query.category;
    if (!categoryId) {
      return res.status(400).json({ error: "Category not provided" });
    }
    const modules = await Module.find({ category: categoryId });

    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Modules" });
  }
};

const getModulesV2 = async (req, res) => {
  try {
    const categoryId = req.query.category;
    const year = req.query.year;
    let query = {};

    if (year) {
      query.years = { $in: [year] }; // Check if year exists in the years array
    }

    if (categoryId) {
      query.category = categoryId;
    }

    const modules = await Module.find(query).sort({ index: 1 });

    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    res.status(500).json({ error: "Error fetching Modules" });
  }
};

const getModulesByName = async (req, res) => {
  try {
    const name = req.query.name; // Assuming 'name' is the new query parameter
    let query = {};

    if (name) {
      query.name = { $regex: new RegExp(name, "i") }; // Case-insensitive regex search for name
    }

    const modules = await Module.find(query);

    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    res.status(500).json({ error: "Error fetching Modules" });
  }
};

const getModulesPaginated = async (req, res) => {
  try {
    const { category, years } = req.query;

    let matchStage = {};

    if (category) {
      matchStage.category = new mongoose.Types.ObjectId(category);
    }

    if (years) {
      // Convert comma-separated string into an array
      const yearsArray = years.split(",");
      matchStage.years = { $in: yearsArray };
    }

    const modules = await Module.aggregate([
      { $match: matchStage },
      { $sort: { index: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: modules,
      totalCount: modules.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching Modules" });
  }
};

module.exports = {
  createModule,
  updateModule,
  deleteModule,
  getModules,
  getModulesV2,
  getModulesPaginated,
  getModulesByName,
};
