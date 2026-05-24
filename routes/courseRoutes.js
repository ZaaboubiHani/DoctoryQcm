const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const userJwt = require("../middlewares/userJwt");
const adminJwt = require('../middlewares/adminJwt')
// Define routes

router.post("/", adminJwt, courseController.createCourse);
router.get("/", userJwt, courseController.getCourses);
router.get("/v2", userJwt, courseController.getCoursesV2);
// router.get("/", courseController.getCoursesByName); //? use this when adding new courses 
router.put("/reorder", courseController.reorderCourses);

router.put("/:id", adminJwt, courseController.updateCourse);
router.delete("/:id", adminJwt, courseController.deleteCourse);

module.exports = router;
