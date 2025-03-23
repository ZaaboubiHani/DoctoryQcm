const express = require("express");
const router = express.Router();
const signalController = require("../controllers/signalController");
const userJwt = require("../middlewares/userJwt");
const adminJwt = require('../middlewares/adminJwt')

// Define routes

router.post("/", userJwt, signalController.createSignal);
router.get("/user", adminJwt, signalController.getSignalsOfUser);
router.get("/", adminJwt, signalController.getSignals);
router.delete("/:id", adminJwt, signalController.deleteSignal);
router.delete("/user/:id", adminJwt, signalController.deleteAllSignalsOfUser);

module.exports = router;
