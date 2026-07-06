const ResidencyQuestion = require("../models/residencyQuestion");
const Residency = require("../models/residency");
const Note = require("../models/note");

const createResidencyQuestion = async (req, res) => {
  try {
    const residency = await Residency.findById(req.body.residency);
    const count = await ResidencyQuestion.countDocuments({ residency: req.body.residency });

    const newResidencyQuestion = new ResidencyQuestion({
      residency: residency.id,
      index: count + 1,
      ...req.body,
    });

    const createdResidencyQuestion = await newResidencyQuestion.save();

    res.status(201).json({ success: true, data: createdResidencyQuestion });
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

    res.status(200).json({ success: true, message: "ResidencyQuestion deleted successfully" });
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
    const { residency } = req.query;
    const userId = req.user.userId;

    if (!residency) {
      return res
        .status(400)
        .json({ error: "Missing residency id in request query" });
    }

    const residencyQuestions = await ResidencyQuestion.find({
      residency,
    })
      .select("-createdAt -updatedAt").sort({ index: 1 })
      .lean(); // important

    const result = await Promise.all(
      residencyQuestions.map(async (question) => {
        const note = await Note.findOne({
          user: userId,
          residencyQuestion: question._id,
        }).lean();

        return {
          ...question,
          note: note ?? null,
        };
      })
    );

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error fetching Residency Questions" });
  }
};

const updateResidencyQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedResidencyQuestion =
      await ResidencyQuestion.findByIdAndUpdate(
        id,
        { $set: req.body },
        {
          new: true,          // return updated doc
          runValidators: true // ensure schema validation
        }
      ).select("-createdAt -updatedAt");

    if (!updatedResidencyQuestion) {
      return res
        .status(404)
        .json({ error: "ResidencyQuestion not found" });
    }

    return res.status(200).json({
      success: true,
      data: updatedResidencyQuestion,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error updating ResidencyQuestion" });
  }
};

const reorderQuestions = async (req, res) => {
  try {
    const questionsOrder = req.body;

    if (!Array.isArray(questionsOrder)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload format",
      });
    }

    const bulkOps = questionsOrder.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { index: item.index } },
      },
    }));

    await ResidencyQuestion.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: "Questions reordered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Error reordering questions",
    });
  }
};



module.exports = {
  createResidencyQuestion,
  deleteResidencyQuestion,
  getResidencyQuestions,
  getResidencyQuestionsV2,
  updateResidencyQuestion,
  reorderQuestions,
};
