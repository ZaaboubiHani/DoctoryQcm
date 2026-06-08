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
    const years = req.body.years.map((year) => {
      if (year == '692ac3009b0bb7926894ee02') {
        return "Residency";
      }
      if (year == '692ac43c9b0bb7926894ee1c') {
        return "Fourth";
      }
      if (year == '692ac4469b0bb7926894ee1e' ) {
        return "Fifth";
      }
      if (year == '692ac4509b0bb7926894ee20' ) {
        return "Sixth";
      }
      if (year == '692ad748b495dbbf7d594457' ) {
        return "Constantine";
      }
      return year;
    });

    const yearIds = req.body.years;

    const updatedModule = await Module.findByIdAndUpdate(moduleId, {
      ...req.body,
      years,
      yearIds,
    }, {
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
        break;
    }

    

    // if (year) {
    //   // query.yearIds = { $in: [new mongoose.Types.ObjectId(year)] }; // Check if year exists in the years array
    //   query.years = { $in: [year] }; // Check if year exists in the years array
    // }

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

    // Filter by category
    if (category) {
      matchStage.category = new mongoose.Types.ObjectId(category);
    }

    // Filter by yearIds
    if (years) {
      const yearsArray = years
        .split(",")
        .map((id) => new mongoose.Types.ObjectId(id.trim()));

      matchStage.yearIds = { $in: yearsArray };
    }

    // Fetch modules
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

const reorderModules = async (req, res) => {
  try {
    const modulesOrder = req.body;

    if (!Array.isArray(modulesOrder)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload format",
      });
    }

    const bulkOps = modulesOrder.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { index: item.index } },
      },
    }));

    await Module.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: "Modules reordered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Error reordering modules",
    });
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
  reorderModules,
};
