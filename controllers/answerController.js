const Answer = require("../models/answer");
const mongoose = require("mongoose");

const createAnswer = async (req, res) => {
  try {
    const existingAnswer = await Answer.findOne({
      user: req.user.userId,
      question: req.body.question,
    });
    if (!existingAnswer) {
      const newAnswer = new Answer({
        user: req.user.userId,
        ...req.body,
      });
      const createdAnswer = await newAnswer.save();

      res.status(201).json(createdAnswer);
    } else {
      res.status(201).json(existingAnswer);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating Answer" });
  }
};

const createAnswerV2 = async (req, res) => {
  try {
    const existingAnswer = await Answer.findOne({
      user: req.user.userId,
      question: req.body.question,
    });
    if (!existingAnswer) {
      const newAnswer = new Answer({
        user: req.user.userId,
        ...req.body,
      });
      const createdAnswer = await newAnswer.save();

      res.status(201).json({ success: true, data: createdAnswer });
    } else {
      res.status(201).json({ success: true, data: existingAnswer });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating Answer" });
  }
};

const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findByIdAndDelete(req.params.id);
    if (answer) {
      await answer.deleteOne();
      res.json({ success: true, message: "Answer removed" });
    } else {
      res.status(404).json({ message: "Answer not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting Answer" });
  }
};

const deleteAnswerV2 = async (req, res) => {
  try {
    const answer = await Answer.findByIdAndDelete(req.params.id);
    if (answer) {
      await answer.deleteOne();
      res.json({ success: true, message: "Answer removed" });
    } else {
      res.status(404).json({ message: "Answer not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting Answer" });
  }
};

const deleteAllAnswersOfUser = async (req, res) => {
  try {
    const userId = req.query.user;

    const deletedAnswers = await Answer.deleteMany({ user: userId });

    if (deletedAnswers.deletedCount > 0) {
      res.status(200).json({ message: "All answers deleted successfully." });
    } else {
      res.status(404).json({ message: "No answers found for this user." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting Answer" });
  }
};

const getAnswersByCourseId = async (req, res) => {
  try {
    const courseId = new mongoose.Types.ObjectId(req.query.course);
    if (!courseId) {
      return res
        .status(404)
        .json({ message: "Missing Course ID in query params" });
    }
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const answers = await Answer.aggregate([
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
      {
        $match: {
          "question.course": courseId,
          user: userId,
        },
      },
      {
        $project: {
          "question._id": 1,
        },
      },
    ]);

    res.json(answers);
  } catch (error) {
    console.error("Error getting answers by course ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAnswersByCourseV2 = async (req, res) => {
  try {
    const courseId = new mongoose.Types.ObjectId(req.query.course);
    if (!courseId) {
      return res
        .status(404)
        .json({ message: "Missing Course ID in query params" });
    }
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const answers = await Answer.aggregate([
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
      {
        $match: {
          "question.course": courseId,
          user: userId,
        },
      },
      {
        $project: {
          _id: 1,
          question: "$question._id",
        },
      },
    ]);

    res.json({ success: true, data: answers });
  } catch (error) {
    console.error("Error getting answers by course ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAnswersByUser = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.query.userId);

    // Get page and limit from query params (default values: page = 1, limit = 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await Answer.countDocuments({ user: userId });

    // Fetch answers with pagination
    const answers = await Answer.aggregate([
      {
        $match: { user: userId },
      },
      {
        $project: {
          answer: 1, // Include answer data
          question: 1, // Include answer data
          createdAt: 1, // Include timestamp (if exists)
        },
      },
      { $sort: { createdAt: -1 } }, // Sort by latest answers
      { $skip: skip },
      { $limit: limit },
    ]);

    res.json({
      success: true,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      data: answers,
    });
  } catch (error) {
    console.error("Error getting answers by user ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createAnswer,
  deleteAnswer,
  getAnswersByCourseId,
  deleteAllAnswersOfUser,
  getAnswersByUser,
  getAnswersByCourseV2,
  createAnswerV2,
  deleteAnswerV2,
};
