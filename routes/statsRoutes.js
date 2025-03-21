const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");
const userJwt = require("../middlewares/userJwt");
// Define routes

router.get("/count", userJwt, statsController.getStats);
router.get("/favourites", userJwt, statsController.getFavouriteStats);
router.get(
  "/answers-per-category",
  userJwt,
  statsController.getAnswersPercentageByCategory
);
router.get(
  "/v2/answers-per-category",
  userJwt,
  statsController.getCategoriesStatsV2
);
router.get(
  "/answers-per-module",
  userJwt,
  statsController.getAnswersPercentageByModule
);
router.get(
  "/v2/answers-per-module",
  userJwt,
  statsController.getModulesStatsV2
);
router.get(
  "/answers-per-course",
  userJwt,
  statsController.getAnswersPercentageByCourse
);
router.get(
  "/v2/answers-per-course",
  userJwt,
  statsController.getCoursesStatsV2
);
router.get(
  "/favouritecategories",
  userJwt,
  statsController.getNumberOfFavouriteQuestionsPerCategory
);
router.get(
  "/favouriteModules",
  userJwt,
  statsController.getNumberOfFavouriteQuestionsPerModule
);
router.get(
  "/favouriteCourses",
  userJwt,
  statsController.getNumberOfFavouriteQuestionsPerCourse
);
module.exports = router;
