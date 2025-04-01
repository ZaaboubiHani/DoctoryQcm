const express = require("express");
const router = express.Router();
const moduleController = require("../controllers/moduleController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", moduleController.createModule);
router.get("/", userJwt, moduleController.getModules);
router.get("/v2", userJwt, moduleController.getModulesV2);
router.get("/name", userJwt, moduleController.getModulesByName);
router.get("/page", userJwt, moduleController.getModulesPaginated);
router.put("/:id", moduleController.updateModule);
router.delete("/:id", moduleController.deleteModule);

module.exports = router;
