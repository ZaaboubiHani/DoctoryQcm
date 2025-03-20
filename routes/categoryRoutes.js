const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const userJwt = require("../middlewares/userJwt");

// Define routes

// router.post("/", categoryController.createCategory);
router.get("/", userJwt, categoryController.getCategories);
router.get("/stats", userJwt, categoryController.getCategoriesWithStats);
router.get("/v2", userJwt, categoryController.getCategoriesV2);
// router.put("/:id", categoryController.updateCategory);
// router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
