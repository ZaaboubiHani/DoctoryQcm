const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", courseController.createCourse);
router.get("/", userJwt, courseController.getCourses);
router.get("/v2", userJwt, courseController.getCoursesV2);
// router.get("/", courseController.getCoursesByName); //? use this when adding new courses 
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
