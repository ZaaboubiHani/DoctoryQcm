const Residency = require("../models/residency");
const Module = require("../models/module");
const ResidencyQuestion = require('../models/residencyQuestion');

const createResidency = async (req, res) => {
  try {
    const count = await Residency.countDocuments();

    const newResidency = new Residency({
      name: req.body.name,
      date: req.body.date,
      type: req.body.type || "exam",
      module: req.body.module || null,
      index: count + 1,
    });

    const createdResidency = await newResidency.save();

    res.status(201).json({ success: true, data: createdResidency });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating Residency" });
  }
};


const deleteResidency = async (req, res) => {
  const residencyId = req.params.id;

  try {
    const deletedResidency = await Residency.findByIdAndDelete(residencyId);

    if (!deletedResidency) {
      return res.status(404).json({ error: "Residency not found" });
    }

    // Delete related questions
    await ResidencyQuestion.deleteMany({ residency: residencyId });

    res.status(200).json({ success: true, message: "Residency and related questions deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting Residency" });
  }
};

const getResidencies = async (req, res) => {
  try {
    const residencies = await Residency.find().select("-createdAt -updatedAt");
    res.status(200).json(residencies);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Residencies" });
  }
};

const getResidenciesV2 = async (req, res) => {
  try {
    const category = req.query.category;
    let query = {};

    if (category) {
      const modules = await Module.find({ category }).select("_id");
      query.module = { $in: modules.map(m => m._id) };
    }
    else {
      query.type = "exam";
    }
    const residencies = await Residency.find(query).select("-createdAt -updatedAt").sort({ index: 1 });
    res.status(200).json({ success: true, data: residencies });
  } catch (error) {
    res.status(500).json({ error: "Error fetching Residencies" });
  }
};

const updateResidency = async (req, res) => {
  const residencyId = req.params.id;

  try {
    const updatedResidency = await Residency.findByIdAndUpdate(
      residencyId,
      {
        name: req.body.name,
        date: req.body.date,
        type: req.body.type || "exam",
        module: req.body.module || null,
      },
      {
        new: true,          // return updated document
        runValidators: true // ensure schema validation
      }
    );

    if (!updatedResidency) {
      return res.status(404).json({ error: "Residency not found" });
    }

    res.status(200).json({ success: true, data: updatedResidency });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating Residency" });
  }
};


const reorderResidencies = async (req, res) => {
  try {
    const residenciesOrder = req.body;

    if (!Array.isArray(residenciesOrder)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload format",
      });
    }

    const bulkOps = residenciesOrder.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { index: item.index } },
      },
    }));

    await Residency.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: "Residencies reordered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Error reordering residencies",
    });
  }
};


module.exports = {
  createResidency,
  updateResidency,
  deleteResidency,
  getResidencies,
  getResidenciesV2,
  reorderResidencies,
};
