const express = require("express");
const router = express.Router();
const residencyController = require("../controllers/residencyController");
const userJwt = require("../middlewares/userJwt");
// const adminJwt = require("../middlewares/adminJwt");

router.get("/", userJwt, residencyController.getResidencies);
router.get("/v2/", userJwt, residencyController.getResidenciesV2);

router.post("/", residencyController.createResidency);
// router.delete("/:id", adminJwt, residencyController.deleteResidency);

module.exports = router;
