const Module = require("../models/module");
const mongoose = require("mongoose");

const createModule = async (req, res) => {
  try {
    const newModule = new Module({
      ...req.body,
    });

    const createdModule = await newModule.save();

    res.status(201).json({ success: true, data: createdModule });
  } catch (error) {
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
    if (!categoryId) {
      return res.status(400).json({ error: "Category not provided" });
    }

    const modules = await Module.find({ category: categoryId });

    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    res.status(500).json({ error: "Error fetching Modules" });
  }
};
const getModulesPaginated = async (req, res) => {
  try {
    const { category, page = 1, limit = 10, years } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;
    
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
      { $match: matchStage }, // Apply filters
      { $sort: { _id: -1 } }, // Sort by newest first
      { $skip: skip }, // Skip previous pages
      { $limit: pageSize }, // Limit results per page
    ]);

    // Count total documents for pagination
    const totalCount = await Module.countDocuments(matchStage);
    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({
      success: true,
      data: modules,
      currentPage: pageNumber,
      totalPages,
      totalCount,
      pageSize,
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
};
