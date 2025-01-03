const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", userJwt, noteController.createNote);
router.get("/", userJwt, noteController.getNote);
router.put("/:id", userJwt,noteController.updateNote);
router.delete("/:id", userJwt,noteController.deleteNote);

module.exports = router;
