const express = require("express");
const router = express.Router();
const yearController = require("../controllers/yearController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", yearController.createYear);
router.get("/", yearController.getYears);
router.put("/:id", yearController.updateYear);
router.delete("/:id", yearController.deleteYear);

module.exports = router;
