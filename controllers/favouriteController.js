const Favourite = require("../models/favourite");
const mongoose = require("mongoose");

const createFavourite = async (req, res) => {
  try {
    const newFavourite = new Favourite({
      user: req.user.userId,
      ...req.body,
    });

    const createdFavourite = await newFavourite.save();

    res.status(201).json(createdFavourite);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating Favourite" });
  }
};

const removeFavourite = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.user.userId;
    await Favourite.deleteOne({ user: userId, question: questionId });
    res.status(204).json({ message: "Favourite removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error removing Favourite" });
  }
};

const getFavouriteCategories = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const favouriteCategories = await Favourite.aggregate([
      {
        $match: {
          user: userId,
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
      { $unwind: "$question" },
      {
        $group: {
          _id: "$question.category",
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
      { $unwind: "$category" },
      {
        $project: {
          _id: "$category._id",
          name: "$category.name",
        },
      },
    ]);

    res.status(200).json(favouriteCategories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error getting Favourite Categories" });
  }
};
const getFavouriteModules = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const categoryId = new mongoose.Types.ObjectId(req.query.category);
    const favouriteModules = await Favourite.aggregate([
      {
        $match: {
          user: userId,
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
      { $unwind: "$question" },
      {
        $match: {
          "question.category": categoryId,
        },
      },
      {
        $group: {
          _id: "$question.module",
        },
      },
      {
        $lookup: {
          from: "modules",
          localField: "_id",
          foreignField: "_id",
          as: "module",
        },
      },
      { $unwind: "$module" },
      {
        $project: {
          _id: "$module._id",
          name: "$module.name",
        },
      },
    ]);

    res
      .status(200)
      .json(favouriteModules);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error getting Favourite Modules" });
  }
};

const getFavouriteCourses = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const moduleId = new mongoose.Types.ObjectId(req.query.module);
    const favouriteCourses = await Favourite.aggregate([
      {
        $match: {
          user: userId,
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
      { $unwind: "$question" },
      {
        $match: {
          "question.module": moduleId,
        },
      },
      {
        $group: {
          _id: "$question.course",
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $project: {
          _id: "$course._id",
          name: "$course.name",
        },
      },
    ]);

    res.status(200).json(favouriteCourses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error getting Favourite Courses" });
  }
};
const getFavouriteQuestions = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const courseId = new mongoose.Types.ObjectId(req.query.course);
    const favouriteQuestions = await Favourite.aggregate([
      {
        $match: {
          user: userId,
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
      { $unwind: "$question" },
      {
        $match: {
          "question.course": courseId,
        },
      },
      {
        $lookup: {
          from: "notes",
          let: { questionId: "$question._id", userId: "$user" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$question", "$$questionId"] },
                    { $eq: ["$user", "$$userId"] },
                  ],
                },
              },
            },
            {
              $project: {
                note: 1,
                _id: 1,
              },
            },
          ],
          as: "note",
        },
      },
      {
        $project: {
          question: {
            _id: "$question._id",
            text: "$question.text",
            choices: "$question.choices",
            correctAnswers: "$question.correctAnswers",
          },
          note: { $arrayElemAt: ["$note", 0] },
        },
      },
    ]);
    res.status(200).json(favouriteQuestions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error getting Favourite Questions" });
  }
};
module.exports = {
  createFavourite,
  removeFavourite,
  getFavouriteCategories,
  getFavouriteModules,
  getFavouriteCourses,
  getFavouriteQuestions,
};
