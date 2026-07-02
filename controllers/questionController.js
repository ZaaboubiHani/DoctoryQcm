const Question = require("../models/question");
const Favourite = require("../models/favourite");
const Note = require("../models/note");
const Module = require("../models/module");
const Category = require("../models/category");
const Course = require("../models/course");
const mongoose = require("mongoose");

const createQuestion = async (req, res) => {
  try {
    const course = await Course.findById(req.body.course);
    const module = await Module.findById(course.module);
    const category = await Category.findById(module.category);

    // Count questions for this course
    const count = await Question.countDocuments({ course: course._id });

    const newQuestion = new Question({
      category: category._id,
      module: module._id,
      course: course._id,
      index: count + 1,
      ...req.body,
    });

    const createdQuestion = await newQuestion.save();

    res.status(201).json({ success: true, data: createdQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating Question" });
  }
};

const updateQuestion = async (req, res) => {
  const questionId = req.params.id;

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json({ success: true, data: updatedQuestion });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating Question" });
  }
};

const deleteQuestion = async (req, res) => {
  const questionId = req.params.id;
  try {
    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting Question" });
  }
};

const getQuestions = async (req, res) => {
  try {


    const course = req.query.course;
    if (!course) {
      return res
        .status(400)
        .json({ error: "Missing course id in request query" });
    }
    const questions = await Question.find({ course: course }).select("_id");
    res.status(200).json(questions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching Question" });
  }
};

const getQuestionsWithDetails = async (req, res) => {
  try {

    const course = req.query.course;
    const userId = req.user.userId;

    if (!course) {
      return res
        .status(400)
        .json({ error: "Missing course id in request query" });
    }
    // Use aggregation to get questions with notes and isFavourite status
    const courseId = new mongoose.Types.ObjectId(course);
    const questions = await Question.aggregate([
      {
        $match: { course: courseId },
      },
      {
        $sort: { index: 1 },
      },
      {
        $lookup: {
          from: "favourites",
          localField: "_id",
          foreignField: "question",
          as: "favourites",
          pipeline: [
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $project: { _id: 1 } }, // Only keep necessary fields to optimize
          ],
        },
      },
      {
        $lookup: {
          from: "notes",
          localField: "_id",
          foreignField: "question",
          as: "notes",
          pipeline: [
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $project: { _id: 1, note: 1 } }, // Only keep the "note" field
          ],
        },
      },
      {
        $project: {
          _id: 1,
          text: 1, // Include other necessary question fields
          choices: 1, // Include other necessary question fields
          createdAt: 1,
          correctAnswers: 1,
          isFavourite: { $gt: [{ $size: "$favourites" }, 0] }, // Check if there are any favourite records
          note: { $arrayElemAt: ["$notes", 0] }, // Get the first note if it exists
        },
      },
    ]);

    res.status(200).json(questions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching Question" });
  }
};

const getQuestionsWithDetailsV2 = async (req, res) => {
  try {
    const course = req.query.course;
    const userId = req.user.userId;

    if (!course) {
      return res
        .status(400)
        .json({ error: "Missing course id in request query" });
    }

    // Use aggregation to get questions with notes and isFavourite status
    const courseId = new mongoose.Types.ObjectId(course);
    const questions = await Question.aggregate([
      {
        $match: { course: courseId },
      },
      {
        $sort: { index: 1 },
      },
      {
        $lookup: {
          from: "favourites",
          let: { questionId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$question", "$$questionId"] },
                    { $eq: ["$user", new mongoose.Types.ObjectId(userId)] },
                  ],
                },
              },
            },
            { $project: { _id: 1 } }, // Only keep the favourite _id
          ],
          as: "favourites",
        },
      },
      {
        $lookup: {
          from: "notes",
          let: { questionId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$question", "$$questionId"] },
                    { $eq: ["$user", new mongoose.Types.ObjectId(userId)] },
                  ],
                },
              },
            },
            { $project: { _id: 1, note: 1 } }, // Only keep the note fields
          ],
          as: "notes",
        },
      },
      {
        $project: {
          _id: 1,
          text: 1,
          choices: 1,
          createdAt: 1,
          correctAnswers: 1,
          isFavourite: { $gt: [{ $size: "$favourites" }, 0] }, // Check if there are any favourite records
          note: { $arrayElemAt: ["$notes", 0] }, // Get the first note if it exists
          favourite: {
            $ifNull: [{ $arrayElemAt: ["$favourites._id", 0] }, null],
          }, // Get the first favourite document if it exists
        },
      },
    ]);

    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching Question" });
  }
};

const getQuestionsPaginated = async (req, res) => {
  try {
    const course = req.query.course;

    if (!course) {
      return res
        .status(400)
        .json({ error: "Missing course id in request query" });
    }

    // Use aggregation to get questions with notes and isFavourite status
    const courseId = new mongoose.Types.ObjectId(course);
    const questions = await Question.aggregate([
      {
        $match: { course: courseId },
      },
      {
        $sort: { index: 1 },
      },

      {
        $project: {
          _id: 1,
          text: 1,
          index: 1,
          category: 1,
          module: 1,
          course: 1,
          choices: 1,
          createdAt: 1,
          correctAnswers: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching Question" });
  }
};

const getSingleQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.user.userId;
    if (!questionId) {
      return res
        .status(400)
        .json({ error: "Missing Question id in request params" });
    }
    const isFavourite = await Favourite.exists({
      user: userId,
      question: questionId,
    });
    const note = await Note.findOne({
      user: userId,
      question: questionId,
    }).select("note");
    let isFav;

    if (!isFavourite) {
      isFav = false;
    } else if (isFavourite) {
      isFav = true;
    }
    const question = await Question.findOne({ _id: questionId })
      .populate({
        path: "course",
        select: "name",
      })
      .populate({
        path: "module",
        select: "name",
      })
      .populate({
        path: "category",
        select: "name",
      });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    const questionWithFavoriteStatus = {
      question: question,
      isFavourite: isFav,
      note: note,
    };

    res.json(questionWithFavoriteStatus);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching Question" });
  }
};
const getSingleQuestionV2 = async (req, res) => {
  try {
    const questionId = req.params.id;
    if (!questionId) {
      return res
        .status(400)
        .json({ error: "Missing Question id in request params" });
    }

    const question = await Question.findOne({ _id: questionId });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json({ success: true, data: question });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching Question" });
  }
};

const generateRandom = async (req, res) => {
  try {
    const categoryIds = await Category.find({}, "_id");
    let result = [];
    for (const category of categoryIds) {
      const questions = await Question.aggregate([
        { $match: { category: new mongoose.Types.ObjectId(category._id) } },
        { $sample: { size: 50 } },
        { $project: { _id: 1 } },
      ]);
      result = result.concat(questions);
    }
    res.json(result);
  } catch (error) {
    console.error("Error getting random questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getRandomQuestionsFromModule = async (req, res) => {
  try {
    const module = req.query.module;
    const questions = await Question.aggregate([
      { $match: { module: new mongoose.Types.ObjectId(module) } },
      { $sample: { size: 40 } },
    ]);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Questions" });
  }
};

const getRandomQuestionsFromModuleV2 = async (req, res) => {
  try {
    const moduleId = req.query.module;
    const year = req.query.year;

    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return res.status(400).json({ error: "Invalid module ID" });
    }

    // Step 1: Find courses that belong to the module and include the given year
    const courseFilter = { module: new mongoose.Types.ObjectId(moduleId) };
    if (year) {
      // courseFilter.yearIds = { $in: [new mongoose.Types.ObjectId(year)] }; // Ensure course has the specified year
      courseFilter.years = { $in: [year] }; // Ensure course has the specified year
    }

    const validCourses = await Course.find(courseFilter).select("_id");
    const validCourseIds = validCourses.map((c) => c._id);

    // Step 2: Fetch Questions only from valid courses
    const questions = await Question.aggregate([
      { $match: { module: new mongoose.Types.ObjectId(moduleId), course: { $in: validCourseIds } } },
      { $sample: { size: 40 } },
    ]);

    res.status(200).json({ success: true, data: { questions } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching Questions" });
  }
};


const getRandomQuestionsFromCategory = async (req, res) => {
  try {
    const categoryId = req.query.category;
    const year = req.query.year;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    // Step 1: Find modules that belong to the category
    const moduleFilter = { category: new mongoose.Types.ObjectId(categoryId) };
    const validModules = await Module.find(moduleFilter).select("_id");
    const validModuleIds = validModules.map((m) => m._id);

    // Step 2: Find courses inside those modules, optionally filtered by year
    const courseFilter = { module: { $in: validModuleIds } };
    if (year) {
      // courseFilter.yearIds = { $in: [new mongoose.Types.ObjectId(year)] }; // course must include the year
      courseFilter.years = { $in: [year] }; // course must include the year
    }

    const validCourses = await Course.find(courseFilter).select("_id");
    const validCourseIds = validCourses.map((c) => c._id);

    const questionsPerModule = Math.floor(50 / validModuleIds.length);
    const remainder = 50 % validModuleIds.length;

    const randomQuestions = await Question.aggregate([
      { $match: { module: { $in: validModuleIds }, course: { $in: validCourseIds } } },
      // Group by module
      {
        $group: {
          _id: "$module",
          questions: { $push: "$$ROOT" }
        }
      },
      // Get random sample from each module
      {
        $project: {
          module: "$_id",
          questions: { $slice: ["$questions", questionsPerModule] }
        }
      },
      // Unwind back to individual documents
      { $unwind: "$questions" },
      { $replaceRoot: { newRoot: "$questions" } },
      // Final random shuffle
      { $sample: { size: 150 } }
    ]);

    if (remainder > 0) {
      // Get additional random questions to fill up to 150
      const extraQuestions = await Question.aggregate([
        {
          $match: {
            module: { $in: validModuleIds },
            _id: { $nin: randomQuestions.map(q => q._id) }
          }
        },
        { $sample: { size: remainder } }
      ]);

      randomQuestions.push(...extraQuestions);
    }


    const questions = await Question.aggregate([
      {
        $match: {
          _id: { $nin: randomQuestions.map(q => q._id) }
        },
      },
      { $sample: { size: 50 } }, // adjust size if needed
    ]);

    res.status(200).json({ success: true, data: { questions } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching Questions" });
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

    await Question.bulkWrite(bulkOps);

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
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestions,
  getSingleQuestion,
  generateRandom,
  getQuestionsWithDetails,
  getQuestionsWithDetailsV2,
  getRandomQuestionsFromModule,
  getRandomQuestionsFromModuleV2,
  getQuestionsPaginated,
  getSingleQuestionV2,
  getRandomQuestionsFromCategory,
  reorderQuestions,
};
