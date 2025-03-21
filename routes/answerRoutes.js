const express = require("express");
const router = express.Router();
const answerController = require("../controllers/answerController");
const userJwt = require("../middlewares/userJwt");
const adminJwt = require('../middlewares/adminJwt')

// Define routes

router.post("/", userJwt, answerController.createAnswer);
router.post("/v2/", userJwt, answerController.createAnswerV2);
router.delete("/many", answerController.deleteAllAnswersOfUser);
router.delete("/:id", userJwt, answerController.deleteAnswer);
router.delete("/v2/:id", userJwt, answerController.deleteAnswerV2);
router.get("/", userJwt, answerController.getAnswersByCourseId);
router.get("/v2/", userJwt, answerController.getAnswersByCourseV2);
router.get("/user", adminJwt, answerController.getAnswersByUser);

module.exports = router;
