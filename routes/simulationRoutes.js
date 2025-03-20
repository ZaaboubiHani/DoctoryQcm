const express = require("express");
const router = express.Router();
const simulationController = require("../controllers/simulationController");
const userJwt = require("../middlewares/userJwt");
const adminJwt = require('../middlewares/adminJwt')

// Define routes

router.post("/", userJwt, simulationController.generateSimulation);
router.post("/v2", userJwt, simulationController.generateSimulation);
router.get("/", userJwt, simulationController.getSimulations);
router.get("/user", adminJwt, simulationController.getSimulationsByUser);
router.put(
  "/:id",
  userJwt,
  simulationController.updateSimlationAnswersQuestions
);
router.put(
  "/v2/:id",
  userJwt,
  simulationController.updateSimlationAnswersQuestionsV2
);
router.delete("/:id", userJwt, simulationController.deleteSimulation);
router.get("/:id", userJwt, simulationController.getSingleSimulation);

module.exports = router;
