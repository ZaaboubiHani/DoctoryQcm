const Signal = require("../models/signal");
const mongoose = require("mongoose");

const createSignal = async (req, res) => {
  try {
    const newSignal = new Signal({
      user: req.user.userId,
      ...req.body,
    });

    const createdSignal = await newSignal.save();

    res.status(201).json(createdSignal);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating Signal" });
  }
};

const getSignals = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.query.userId);

    // Get page and limit from query params (default values: page = 1, limit = 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await Signal.countDocuments({ user: userId });

    // Fetch signals with pagination
    const signals = await Signal.aggregate([
      {
        $match: { user: userId },
      },
      {
        $project: {
          signal: 1, 
          createdAt: 1, 
          updatedAt: 1, 
        },
      },
      { $sort: { createdAt: -1 } }, // Sort by latest signals
      { $skip: skip },
      { $limit: limit },
    ]);

    res.json({
      success: true,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      data: signals,
    });
  } catch (error) {
    console.error("Error getting signals by user ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteSignal = async (req, res) => {
  try {
    const signalId = new mongoose.Types.ObjectId(req.params.id);

    // Find and delete the signal
    const deletedSignal = await Signal.findByIdAndDelete(signalId);

    if (!deletedSignal) {
      return res.status(404).json({ success: false, message: "Signal not found" });
    }

    res.json({ success: true, message: "Signal deleted successfully" });
  } catch (error) {
    console.error("Error deleting signal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  createSignal,
  getSignals,
  deleteSignal,
};
