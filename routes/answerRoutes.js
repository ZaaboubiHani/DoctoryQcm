const express = require("express");
const router = express.Router();
const answerController = require("../controllers/answerController");
const userJwt = require("../middlewares/userJwt");
const adminJwt = require('../middlewares/adminJwt')

// Define routes

router.post("/", userJwt, answerController.createAnswer);
router.delete("/many", answerController.deleteAllAnswersOfUser);
router.delete("/:id", userJwt, answerController.deleteAnswer);
router.get("/", userJwt, answerController.getAnswersByCourseId);
router.get("/user", adminJwt, answerController.getAnswersByUser);

module.exports = router;
