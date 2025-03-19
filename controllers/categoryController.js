const Category = require("../models/category");
const Module = require("../models/module");
const Course = require("../models/course");
const Question = require("../models/question");

const createCategory = async (req, res) => {
  try {
    const newCategory = new Category({
      name: req.body.name,
    });

    const createdCategory = await newCategory.save();

    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ error: "Error creating Category" });
  }
};
const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      req.body,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: "Error updating Category" });
  }
};
const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting Category" });
  }
};
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Categories" });
  }
};

const getCategoriesWithStats = async (req, res) => {
  try {
    const categories = await Category.find();
    let result = [];
    let correctResult = [];
    for (const category of categories) {
      const modulesNum = await Module.countDocuments({
        category: category._id,
      });
    
      const modulesInCategory = await Module.find({ category: category._id });
    
      const moduleIds = modulesInCategory.map((module) => module._id);
    
      const coursesNum = await Course.countDocuments({
        module: { $in: moduleIds },
      });
    
      const questionsNum = await Question.countDocuments({
        category: category._id,
      });
    
      // Convert to plain object before modifying
      const categoryObj = category.toObject();
      
      categoryObj.modulesNum = modulesNum;
      categoryObj.coursesNum = coursesNum;
      categoryObj.questionsNum = questionsNum;
      
      correctResult.push(categoryObj);
      result.push({
        category: category,
        modulesNum: modulesNum,
        coursesNum: coursesNum,
        questionsNum: questionsNum,//todo: this part will be removed in the future
      });
    }
     //todo: fix
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Categories with stats" });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategoriesWithStats,
};
