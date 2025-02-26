const express = require("express");
const { analyzeResume, upload } = require("../controllers/ai.controller");

const router = express.Router();

// Apply Multer middleware before `analyzeResume`
router.post("/analyze-resume", upload, analyzeResume);

module.exports = router;
