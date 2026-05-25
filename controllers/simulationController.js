const mongoose = require("mongoose");
const Category = require("../models/category");
const Question = require("../models/question");
const Simulation = require("../models/simulation");
const User = require("../models/user");
const Course = require("../models/course");

const generateSimulation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const categoryIds = await Category.find({}, "_id");
    let questions = [];
    for (const category of categoryIds) {
      const randomQuestions = await Question.aggregate([
        { $match: { category: new mongoose.Types.ObjectId(category._id) } },
        { $sample: { size: 50 } },
        { $project: { _id: 1 } },
      ]);
      questions = questions.concat(
        randomQuestions.map((question) => ({
          question: question._id,
          answers: [],
        }))
      );
    }
    const simulation = new Simulation({
      user: userId,
      questions: questions,
    });
    await simulation.save();
    await simulation.populate({
      path: "questions.question",
      select: "-course -module -createdAt -updatedAt",
    });
    res.status(201).json(simulation);
  } catch (error) {
    console.error("Error generating simulation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const generateSimulationV2 = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const userYear = user.year;

    let questionIds = [];

    if (userYear === "Residency") {
      // Get valid courses for Residency
      const validCourses = await Course.find(
        { years: { $in: [userYear] } },
        "_id"
      );
      const validCourseIds = validCourses.map((c) => c._id);

      // Get all categories
      const categories = await Category.find({}, "_id");

      // Get 50 random questions per category (preserving category order)
      for (const category of categories) {
        const randomQuestions = await Question.aggregate([
          {
            $match: {
              category: new mongoose.Types.ObjectId(category._id),
              course: { $in: validCourseIds },
            },
          },
          { $sample: { size: 50 } },
          { $project: { _id: 1 } },
        ]);

        questionIds.push(...randomQuestions.map((q) => q._id));
      }
    } else {
      // Regular years
      const courses = await Course.find(
        { years: userYear },
        "_id"
      );
      const courseIds = courses.map((c) => c._id);

      if (courseIds.length === 0) {
        return res
          .status(404)
          .json({ error: "No courses found for this year." });
      }

      const randomQuestions = await Question.aggregate([
        { $match: { course: { $in: courseIds } } },
        { $sample: { size: 150 } },
        { $project: { _id: 1 } },
      ]);

      questionIds = randomQuestions.map((q) => q._id);
    }

    // Fetch full question data + populate category
    let questions = await Question.find({ _id: { $in: questionIds } })
      .select("text category choices correctAnswers")
      .populate({
        path: "category",
        model: "Category",
        select: "name",
      });

    // Re-order questions to match the original questionIds order
    const questionMap = new Map(questions.map(q => [q._id.toString(), q]));
    questions = questionIds.map(id => questionMap.get(id.toString())).filter(Boolean);

    // Format response
    const formattedQuestions = questions.map((q) => ({
      _id: q._id,
      text: q.text,
      choices: q.choices,
      correctAnswers: q.correctAnswers,
      category: q.category?.name || null,
      answers: [],
    }));

    const simulation = new Simulation({
      user: userId,
      questions: questions.map((q) => ({
        question: q._id,
        answers: [],
      })),
    });

    await simulation.save();

    res.status(200).json({
      success: true,
      data: {
        _id: simulation._id,
        user: userId,
        questions: formattedQuestions,
      },
    });
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const deleteSimulation = async (req, res) => {
  try {
    const simulationId = req.params.id;
    const removedSimulation = Simulation.findByIdAndDelete(simulationId);
    if (!removedSimulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Simulation deleted successfully" });
  } catch (error) {
    console.error("Error deleting simulation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteAllSimulationsOfUser = async (req, res) => {
  try {
    const userId = req.query.user; // Assuming authentication middleware provides `userId`

    // Delete all simulations belonging to the user
    const deleteResult = await Simulation.deleteMany({ user: userId });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ error: "No simulations found for this user" });
    }

    res.status(200).json({ success: true, message: "All simulations deleted successfully" });
  } catch (error) {
    console.error("Error deleting simulations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const updateSimlationAnswersQuestions = async (req, res) => {
  try {
    const simulationId = req.params.id;
    const { answers, score, timeSpent } = req.body;
    const simulation = await Simulation.findById(simulationId);
    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }
    simulation.questions = answers;
    simulation.score = score;
    simulation.timeSpent = timeSpent;
    await simulation.save();
    res.status(200).json({ message: "Simulation updated successfully" });
  } catch (error) {
    console.error("Error updating simulation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateSimlationAnswersQuestionsV2 = async (req, res) => {
  try {
    const simulationId = req.params.id;
    const { answers, score, timeSpent } = req.body;
    const simulation = await Simulation.findById(simulationId);
    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }
    simulation.questions = answers;
    simulation.score = score;
    simulation.timeSpent = timeSpent;
    await simulation.save();
    res
      .status(200)
      .json({ success: true, message: "Simulation updated successfully" });
  } catch (error) {
    console.error("Error updating simulation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSimulations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const simulations = await Simulation.find({ user: userId })
      .select("id score updatedAt timeSpent")
      .sort("-createdAt");
    res.status(200).json(simulations);
  } catch (error) {
    console.error("Error getting simulations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getSimulationsV2 = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get page and limit from query params, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch paginated simulations
    const simulations = await Simulation.find({ user: userId })
      .select("id score updatedAt timeSpent")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    // Get total count for pagination info
    const totalSimulations = await Simulation.countDocuments({ user: userId });
    const totalPages = Math.ceil(totalSimulations / limit);

    res.status(200).json({
      success: true,
      data: simulations,
      currentPage: page,
      totalPages,
      totalItems: totalSimulations,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("Error getting simulations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSimulationsByUser = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.query.userId);

    // Get page and limit from query params (default values: page = 1, limit = 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await Simulation.countDocuments({ user: userId });

    // Fetch simulations with pagination
    const simulations = await Simulation.aggregate([
      {
        $match: { user: userId },
      },
      {
        $project: {
          score: 1,
          questions: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $sort: { createdAt: -1 } }, // Sort by latest simulations
      { $skip: skip },
      { $limit: limit },
    ]);

    res.json({
      success: true,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      data: simulations,
    });
  } catch (error) {
    console.error("Error getting simulations by user ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSingleSimulation = async (req, res) => {
  try {
    const simulationId = req.params.id;
    const simulation = await Simulation.findById(simulationId).populate({
      path: "questions.question",
      model: "Question",
      populate: [
        { path: "category", model: "Category", select: "name" },
        { path: "course", model: "Course", select: "name" },
        { path: "module", model: "Module", select: "name" },
      ],
    });

    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }
    res.status(200).json(simulation);
  } catch (error) {
    console.error("Error getting single simulation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSingleSimulationV2 = async (req, res) => {
  try {
    const simulationId = req.params.id;
    const simulation = await Simulation.findById(simulationId).populate({
      path: "questions.question",
      model: "Question",
      select: "text category course module correctAnswers choices", // Select fields from Question model directly
      populate: [
        { path: "category", model: "Category", select: "name" },
        { path: "course", model: "Course", select: "name" },
        { path: "module", model: "Module", select: "name" },
      ],
    });

    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }

    // Flatten nested 'question' objects safely
    const flattenedQuestions = simulation.questions
      .map((q) => {
        if (!q.question) return null; // Handle missing question object

        return {
          ...q.question.toObject(), // Spread properties of 'question' object
          category: q.question.category?.name || null, // Safe access with fallback
          course: q.question.course?.name || null,
          module: q.question.module?.name || null,
          userAnswers: q.answers,
        };
      })
      .filter(Boolean); // Remove any null values

    // Replace 'questions' array in simulation with flattened version
    const responseSimulation = simulation.toObject(); // Convert Mongoose object to plain JS object
    responseSimulation.questions = flattenedQuestions;

    res.status(200).json({ success: true, data: responseSimulation });
  } catch (error) {
    console.error("Error getting single simulation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  generateSimulation,
  deleteSimulation,
  updateSimlationAnswersQuestions,
  getSimulations,
  getSingleSimulation,
  getSimulationsByUser,
  updateSimlationAnswersQuestionsV2,
  generateSimulationV2,
  getSimulationsV2,
  getSingleSimulationV2,
  deleteAllSimulationsOfUser,
};
