const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const adminJwt = require("../middlewares/adminJwt");

router.post("/doc", adminJwt, fileController.uploadDocument);
router.delete("/:id", adminJwt, fileController.deleteFile);

module.exports = router;
