const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
// bring the Course model
const Course = require("../models/Course");
// advancedResults middleware
const advancedResults = require("../middleware/advancedResults");
// initialize Router
// { mergeParams: true } is used to merging the url params from courses
const router = express.Router({ mergeParams: true });
// include protect and authorize middleware
const { protect, authorize } = require("../middleware/auth");
// in our bootcamps route we are forwarding the request to courseRouter
//so for post request with id we can simply add a .post()
//we add {protect} middleware to addCourse
router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, authorize("publisher", "admin"), addCourse);
//we add {protect} middleware to updateCourse deleteCourse
router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);
module.exports = router;
