const express = require("express");
const router = express.Router();
const signalController = require("../controllers/signalController");
const userJwt = require("../middlewares/userJwt");
const adminJwt = require('../middlewares/adminJwt')

// Define routes

router.post("/", userJwt, signalController.createSignal);
router.get("/user", adminJwt, signalController.getSignals);
router.delete("/:id", adminJwt, signalController.deleteSignal);

module.exports = router;
