const Module = require("../models/module");

const createModule = async (req, res) => {
  try {
    const newModule = new Module({
      ...req.body,
    });

    const createdModule = await newModule.save();

    res.status(201).json(createdModule);
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

    res.status(200).json(updatedModule);
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

    res.status(200).json({ message: "Module deleted successfully" });
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
    //todo: fix
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Modules" });
  }
};

module.exports = {
  createModule,
  updateModule,
  deleteModule,
  getModules,
};
