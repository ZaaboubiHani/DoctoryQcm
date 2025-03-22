const Residency = require("../models/residency");

const createResidency = async (req, res) => {
  try {
    const newResidency = new Residency({
      name: req.body.name,
      date: req.body.date,
    });

    const createdResidency = await newResidency.save();

    res.status(201).json(createdResidency);
  } catch (error) {
    console.log(error);
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

    res.status(200).json({ message: "Residency deleted successfully" });
  } catch (error) {
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
    const residencies = await Residency.find().select("-createdAt -updatedAt");
    res.status(200).json({ success: true, data: residencies });
  } catch (error) {
    res.status(500).json({ error: "Error fetching Residencies" });
  }
};

module.exports = {
  createResidency,
  deleteResidency,
  getResidencies,
  getResidenciesV2,
};
