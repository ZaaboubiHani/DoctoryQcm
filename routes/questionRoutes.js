const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const userJwt = require("../middlewares/userJwt");
const adminJwt = require("../middlewares/adminJwt");

// Define routes

router.post("/", questionController.createQuestion);
router.get(
  "/randommodule",
  userJwt,
  questionController.getRandomQuestionsFromModule
);

router.get(
  "/randomCategory",
  userJwt,
  questionController.getRandomQuestionsFromCategory
);

router.get("/", userJwt, questionController.getQuestions);
router.get("/random", userJwt, questionController.generateRandom);
router.get("/details", userJwt, questionController.getQuestionsWithDetails);
router.get(
  "/v2/details",
  userJwt,
  questionController.getQuestionsWithDetailsV2
);
router.get("/page", userJwt, questionController.getQuestionsPaginated);
router.get("/:id", userJwt, questionController.getSingleQuestion);
router.get("/v2/:id", adminJwt, questionController.getSingleQuestionV2);
router.put("/:id", adminJwt, questionController.updateQuestion);
router.delete("/:id", adminJwt, questionController.deleteQuestion);

module.exports = router;
