const express = require("express");
const router = express.Router();
const versionController = require("../controllers/versionController");
const userJwt = require("../middlewares/userJwt");
const adminJwt = require("../middlewares/adminJwt");

// Define routes

router.post("/", adminJwt, versionController.createVersion);
router.get("/", adminJwt, versionController.getVersions);
router.put("/:id", adminJwt, versionController.updateVersion);
router.delete("/:id", adminJwt, versionController.deleteVersion);

module.exports = router;
