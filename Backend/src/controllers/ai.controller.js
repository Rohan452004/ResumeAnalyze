const { analyzeResume } = require("../services/ai.service"); 
console.log("aiService:", analyzeResume);
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

// Configure Multer for file uploads (stores in memory for security)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports.analyzeResume = async (req, res) => {
  try {
    console.log("📥 Incoming Request:");
    console.log("🔹 File:", req.file); // Should show file details
    console.log("🔹 Job Description:", req.body.jobDescription);

    if (!req.file || !req.body.jobDescription) {
      return res
        .status(400)
        .json({ error: "Resume file and job description are required" });
    }

    const jobDescription = req.body.jobDescription;
    const pdfBuffer = req.file.buffer; // Since we're using memory storage

    // Extract text from the uploaded PDF
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    // Call AI service with extracted resume text and job description
    const response = await analyzeResume(resumeText, jobDescription);

    res.status(200).json({ review: response });
  } catch (error) {
    console.error("❌ Error analyzing resume:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Export Multer middleware for use in routes
module.exports.upload = upload.single("resume");
