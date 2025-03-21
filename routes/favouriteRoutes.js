const express = require("express");
const router = express.Router();
const favouriteController = require("../controllers/favouriteController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", userJwt, favouriteController.createFavourite);
router.post("/v2/", userJwt, favouriteController.createFavouriteV2);
router.delete("/:id", userJwt, favouriteController.removeFavourite);
router.delete("/v2/:id", userJwt, favouriteController.removeFavouriteV2);
router.get("/categories", userJwt, favouriteController.getFavouriteCategories);
router.get("/v2/categories", userJwt, favouriteController.getFavouriteCategoriesV2);
router.get("/modules", userJwt, favouriteController.getFavouriteModules);
router.get("/v2/modules", userJwt, favouriteController.getFavouriteModulesV2);
router.get("/courses", userJwt, favouriteController.getFavouriteCourses);
router.get("/v2/courses", userJwt, favouriteController.getFavouriteCoursesV2);
router.get("/questions", userJwt, favouriteController.getFavouriteQuestions);
router.get("/v2/questions", userJwt, favouriteController.getFavouriteQuestionsV2);

module.exports = router;
