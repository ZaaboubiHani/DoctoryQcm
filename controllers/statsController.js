const Category = require("../models/category");
const Module = require("../models/module");
const Course = require("../models/course");
const Question = require("../models/question");
const mongoose = require("mongoose");
const Favourite = require("../models/favourite");
const User = require("../models/user");

const getStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    // Count categories for all users
    const categories = await Category.countDocuments();

    // Count modules for the specific user's year
    const user = await User.findById(userId);
    // const userYear = user.yearId; // Assuming 'year' is the enum property in User model
    const userYear = user.year; // Assuming 'year' is the enum property in User model
    // const modules = await Module.countDocuments({ yearIds: { $in: [userYear] } });
    const modules = await Module.countDocuments({ years: { $in: [userYear] } });

    // Count courses for the specific user's year
    // const courses = await Course.countDocuments({ yearIds: { $in: [userYear] } });
    const courses = await Course.countDocuments({ years: { $in: [userYear] } });

    // Get course IDs that match the user's year
    // const courseIds = await Course.find({ yearIds: { $in: [userYear] } }).distinct("_id");
    const courseIds = await Course.find({ years: { $in: [userYear] } }).distinct("_id");

    // Count questions that belong to those courses
    const questions = await Question.countDocuments({
      course: { $in: courseIds },
    });

    res.status(200).json({
      success: true,
      data: { categories, modules, courses, questions },
      categories,
      modules,
      courses,
      questions, //todo: this will be removed in the future
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error Getting Stats" });
  }
};

const getNumberOfFavouriteQuestionsPerCategory = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const favouriteQuestionsPerCategory = await Category.aggregate([
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "category",
          as: "questions",
        },
      },
      {
        $lookup: {
          from: "answers",
          let: { questionIds: "$questions._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$question", "$$questionIds"] },
                    { $eq: ["$user", userId] },
                    { $eq: ["$favourite", true] },
                  ],
                },
              },
            },
          ],
          as: "favouriteAnswers",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          favouriteQuestions: { $size: "$favouriteAnswers" },
        },
      },
    ]);

    res.status(200).json(favouriteQuestionsPerCategory);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error getting Favourite Questions by Category" });
  }
};

const getNumberOfFavouriteQuestionsPerModule = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const categoryId = new mongoose.Types.ObjectId(req.query.category);

    const favouriteQuestionsPerModule = await Module.aggregate([
      {
        $match: {
          category: categoryId,
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "module",
          as: "questions",
        },
      },
      {
        $lookup: {
          from: "answers",
          let: { questionIds: "$questions._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$question", "$$questionIds"] },
                    { $eq: ["$user", userId] },
                    { $eq: ["$favourite", true] },
                  ],
                },
              },
            },
          ],
          as: "favouriteAnswers",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          favouriteQuestions: { $size: "$favouriteAnswers" },
        },
      },
    ]);

    res.status(200).json(favouriteQuestionsPerModule);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error getting Favourite Questions by Module" });
  }
};

const getNumberOfFavouriteQuestionsPerCourse = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const moduleId = new mongoose.Types.ObjectId(req.query.module);

    const favouriteQuestionsPerCourse = await Course.aggregate([
      {
        $match: {
          module: moduleId,
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "course",
          as: "questions",
        },
      },
      {
        $lookup: {
          from: "answers",
          let: { questionIds: "$questions._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$question", "$$questionIds"] },
                    { $eq: ["$user", userId] },
                    { $eq: ["$favourite", true] },
                  ],
                },
              },
            },
          ],
          as: "favouriteAnswers",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          favouriteQuestions: { $size: "$favouriteAnswers" },
        },
      },
    ]);

    res.status(200).json(favouriteQuestionsPerCourse);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error getting Favourite Questions by Course" });
  }
};

const getAnswersPercentageByCategory = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const answersPerCategory = await Category.aggregate([
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "category",
          as: "questions",
        },
      },
      {
        $lookup: {
          from: "answers",
          let: { questionIds: "$questions._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$question", "$$questionIds"] },
                    { $eq: ["$user", userId] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: { question: "$question", user: "$user" },
                uniqueAnswers: {
                  $addToSet: { question: "$question", user: "$user" },
                },
              },
            },
            {
              $project: {
                _id: 0,
                answers: { $size: "$uniqueAnswers" },
              },
            },
          ],
          as: "answers",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalQuestions: { $size: "$questions" },
          answeredQuestions: { $sum: "$answers.answers" },
          percentage: {
            $cond: [
              { $eq: [{ $size: "$questions" }, 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: [
                      { $sum: "$answers.answers" },
                      { $size: "$questions" },
                    ],
                  },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);

    res.status(200).json(answersPerCategory);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error getting Answers Percentage by Category" });
  }
};

const getCategoriesStatsV2 = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const user = await User.findById(userId);
    // const userYear = user.yearId;
    const userYear = user.year;

    // const validCourses = await Course.find({ yearIds: { $in: [userYear] } }).select("_id");
    const validCourses = await Course.find({ years: { $in: [userYear] } }).select("_id");
    const validCourseIds = validCourses.map((c) => c._id);

    const answersPerCategory = await Category.aggregate([
      {
        $lookup: {
          from: "questions",
          let: { categoryId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$category", "$$categoryId"] },
                    { $in: ["$course", validCourseIds] },
                  ],
                },
              },
            },
          ],
          as: "questions",
        },
      },
      {
        $lookup: {
          from: "answers",
          let: { questionIds: "$questions._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$question", "$$questionIds"] },
                    { $eq: ["$user", userId] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: { question: "$question", user: "$user" },
              },
            },
            {
              $count: "answeredQuestions",
            },
          ],
          as: "answers",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalQuestions: { $size: "$questions" },
          answeredQuestions: {
            $ifNull: [{ $arrayElemAt: ["$answers.answeredQuestions", 0] }, 0],
          },
          percentage: {
            $cond: [
              { $eq: [{ $size: "$questions" }, 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: [
                      {
                        $ifNull: [
                          { $arrayElemAt: ["$answers.answeredQuestions", 0] },
                          0,
                        ],
                      },
                      { $size: "$questions" },
                    ],
                  },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);

    res.status(200).json({ success: true, data: answersPerCategory });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error getting Answers Percentage by Category" });
  }
};

const getAnswersPercentageByModule = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const categoryId = new mongoose.Types.ObjectId(req.query.category);

    const answersPerModule = await Module.aggregate([
      {
        $match: {
          category: categoryId,
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "module",

          as: "questions",
        },
      },
      {
        $lookup: {
          from: "answers",
          let: { questionIds: "$questions._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$question", "$$questionIds"] },
                    { $eq: ["$user", userId] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: { question: "$question", user: "$user" },
                uniqueAnswers: {
                  $addToSet: { question: "$question", user: "$user" },
                },
              },
            },
            {
              $project: {
                _id: 0,
                answers: { $size: "$uniqueAnswers" },
              },
            },
          ],
          as: "answers",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalQuestions: { $size: "$questions" },
          answeredQuestions: { $sum: "$answers.answers" },
          percentage: {
            $cond: [
              { $eq: [{ $size: "$questions" }, 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: [
                      { $sum: "$answers.answers" },
                      { $size: "$questions" },
                    ],
                  },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);

    res.status(200).json(answersPerModule);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error getting Answers Percentage by Module" });
  }
};

const getModulesStatsV2 = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const user = await User.findById(userId);
    // const userYear = user.yearId;
    const userYear = user.year;

    // const validCourses = await Course.find({ yearIds: { $in: [userYear] } }).select("_id");
    const validCourses = await Course.find({ years: { $in: [userYear] } }).select("_id");
    const validCourseIds = validCourses.map((c) => c._id);
    let matchStage = {};
    let query = {};

    if (req.query.category) {
      matchStage.category = new mongoose.Types.ObjectId(req.query.category);
    }

    const year = req.query.year;
    if (year) {
      // query.yearIds = { $in: [new mongoose.Types.ObjectId(year)] }; // Check if the year exists in the years array
      query.years = { $in: [year] }; // Check if the year exists in the years array
    }

    const answersPerModule = await Module.aggregate([
      {
        $match: matchStage,
      },
      {
        $match: query,
      },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "module",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                   
                    { $in: ["$course", validCourseIds] },
                  ],
                },
              },
            },
          ],
          as: "questions",
        },
      },
      {
        $lookup: {
          from: "answers",
          let: { questionIds: "$questions._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$question", "$$questionIds"] },
                    { $eq: ["$user", userId] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: { question: "$question", user: "$user" },
                uniqueAnswers: {
                  $addToSet: { question: "$question", user: "$user" },
                },
              },
            },
            {
              $project: {
                _id: 0,
                answers: { $size: "$uniqueAnswers" },
              },
            },
          ],
          as: "answers",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalQuestions: { $size: "$questions" },
          answeredQuestions: { $sum: "$answers.answers" },
          percentage: {
            $cond: [
              { $eq: [{ $size: "$questions" }, 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: [
                      { $sum: "$answers.answers" },
                      { $size: "$questions" },
                    ],
                  },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);

    res.status(200).json({ success: true, data: answersPerModule });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error getting Answers Percentage by Module" });
  }
};

const getAnswersPercentageByCourse = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const moduleId = new mongoose.Types.ObjectId(req.query.module);

    const answersPerCourse = await Course.aggregate([
      {
        $match: {
          module: moduleId,
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "course",
          as: "questions",
        },
      },
      {
        $lookup: {
          from: "answers",
          let: { questionIds: "$questions._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$question", "$$questionIds"] },
                    { $eq: ["$user", userId] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: { question: "$question", user: "$user" },
                uniqueAnswers: {
                  $addToSet: { question: "$question", user: "$user" },
                },
              },
            },
            {
              $project: {
                _id: 0,
                answers: { $size: "$uniqueAnswers" },
              },
            },
          ],
          as: "answers",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalQuestions: { $size: "$questions" },
          answeredQuestions: { $sum: "$answers.answers" },
          percentage: {
            $cond: [
              { $eq: [{ $size: "$questions" }, 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: [
                      { $sum: "$answers.answers" },
                      { $size: "$questions" },
                    ],
                  },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);

    res.status(200).json(answersPerCourse);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error getting Answers Percentage by Course" });
  }
};

const getCoursesStatsV2 = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    let matchStage = {};
    let query = {};

    if (req.query.module) {
      matchStage.module = new mongoose.Types.ObjectId(req.query.module);
    }

    const year = req.query.year;
    if (year) {
      // query.yearIds = { $in: [new mongoose.Types.ObjectId(year)] }; // Check if the year exists in the years array
      query.years = { $in: [year] }; // Check if the year exists in the years array
    }

    const answersPerCourse = await Course.aggregate([
      {
        $match: matchStage,
      },
      {
        $match: query, // Apply year filter if provided
      },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "course",
          as: "questions",
        },
      },
      {
        $lookup: {
          from: "answers",
          let: { questionIds: "$questions._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$question", "$$questionIds"] },
                    { $eq: ["$user", userId] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: { question: "$question", user: "$user" },
                uniqueAnswers: {
                  $addToSet: { question: "$question", user: "$user" },
                },
              },
            },
            {
              $project: {
                _id: 0,
                answers: { $size: "$uniqueAnswers" },
              },
            },
          ],
          as: "answers",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalQuestions: { $size: "$questions" },
          answeredQuestions: { $sum: "$answers.answers" },
          percentage: {
            $cond: [
              { $eq: [{ $size: "$questions" }, 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: [
                      { $sum: "$answers.answers" },
                      { $size: "$questions" },
                    ],
                  },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);

    res.status(200).json({ success: true, data: answersPerCourse });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error getting Answers Percentage by Course" });
  }
};

const getFavouriteStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const results = await Favourite.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      {
        $unwind: "$question",
      },
      {
        $group: {
          _id: "$question.category",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          _id: 0,
          category: "$category",
          count: 1,
        },
      },
    ]);

    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error getting favourite stats" });
  }
};
module.exports = {
  getStats,
  getFavouriteStats,
  getAnswersPercentageByCategory,
  getAnswersPercentageByModule,
  getAnswersPercentageByCourse,
  getNumberOfFavouriteQuestionsPerCategory,
  getNumberOfFavouriteQuestionsPerCourse,
  getNumberOfFavouriteQuestionsPerModule,
  getCategoriesStatsV2,
  getModulesStatsV2,
  getCoursesStatsV2,
};
