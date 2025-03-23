const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const userJwt = require("../middlewares/userJwt");
const adminJwt = require('../middlewares/adminJwt')

// Define routes

router.post("/", userJwt, noteController.createNote);
router.post("/v2/", userJwt, noteController.createNoteV2);
router.get("/", userJwt, noteController.getNote);
router.get("/user", adminJwt, noteController.getNotes);
router.put("/:id", userJwt,noteController.updateNote);
router.put("/v2/:id", userJwt,noteController.updateNoteV2);
router.delete("/:id", userJwt,noteController.deleteNote);
router.delete("/user/:id", userJwt,noteController.deleteAllNotesOfUser);
router.delete("v2/:id", userJwt,noteController.deleteNoteV2);

module.exports = router;
