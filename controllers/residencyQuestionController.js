const ResidencyQuestion = require("../models/residencyQuestion");
const Residency = require("../models/residency");
const Note = require("../models/note");

const createResidencyQuestion = async (req, res) => {
  try {
    const residency = await Residency.findById(req.body.residency);
    const newResidencyQuestion = new ResidencyQuestion({
      residency: residency.id,
      ...req.body,
    });

    const createdResidencyQuestion = await newResidencyQuestion.save();

    res.status(201).json(createdResidencyQuestion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating ResidencyQuestion" });
  }
};

const deleteResidencyQuestion = async (req, res) => {
  const residencyQuestionId = req.params.id;
  try {
    const deletedResidencyQuestion = await ResidencyQuestion.findByIdAndDelete(
      residencyQuestionId
    );

    if (!deletedResidencyQuestion) {
      return res.status(404).json({ error: "ResidencyQuestion not found" });
    }

    res.status(200).json({ message: "ResidencyQuestion deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting ResidencyQuestion" });
  }
};

const getResidencyQuestions = async (req, res) => {
  try {
    const residency = req.query.residency;
    const userId = req.user.userId;
    if (!residency) {
      return res
        .status(400)
        .json({ error: "Missing residency id in request query" });
    }
    const residencyQuestions = await ResidencyQuestion.find({
      residency: residency,
    }).select("-createdAt -updatedAt");
    let result = [];
    for (const question of residencyQuestions) {
      const note = await Note.findOne({
        user: userId,
        residencyQuestion: question._id,
      }).select("note");

      result.push({
        question: question,
        note: note,
      });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Residency Questions" });
  }
};

const getResidencyQuestionsV2 = async (req, res) => {
  try {
    const residency = req.query.residency;
    const userId = req.user.userId;
    if (!residency) {
      return res
        .status(400)
        .json({ error: "Missing residency id in request query" });
    }
    const residencyQuestions = await ResidencyQuestion.find({
      residency: residency,
    }).select("-createdAt -updatedAt");
    let result = [];
    for (const question of residencyQuestions) {
      const note = await Note.findOne({
        user: userId,
        residencyQuestion: question._id,
      }).select("note");

      result.push({
        ...question.toObject(),
        note: note,
      });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: "Error fetching Residency Questions" });
  }
};

module.exports = {
  createResidencyQuestion,
  deleteResidencyQuestion,
  getResidencyQuestions,
  getResidencyQuestionsV2,
};
