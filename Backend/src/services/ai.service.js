const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require("pdf-parse");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `
        You are an AI Resume Analyzer with expertise in recruitment and hiring processes.
        Your role is to evaluate a candidate's resume based on a given job description.

        Key Responsibilities:
        • Assess resume content against the job requirements.
        • Identify missing or weak skills compared to the job description.
        • Suggest improvements for better ATS (Applicant Tracking System) compatibility.
        • Highlight key strengths in the resume.
        • Provide a detailed evaluation with action points.

        Review Guidelines:
        1. **Skill Matching**: Compare the candidate's skills with the job requirements.
        2. **ATS Optimization**: Check for formatting, keyword optimization, and readability.
        3. **Experience Relevance**: Analyze if the candidate’s past roles align with the job.
        4. **Achievements & Impact**: Ensure that the resume includes measurable outcomes.
        5. **Suggestions for Improvement**: Offer actionable recommendations for enhancement.

        Output Format:
        - 🔍 **Matching Skills**: List the skills from the resume that match the job description.
        - ⚠️ **Missing or Weak Skills**: Identify skills that are required but not present or underrepresented.
        - 📄 **Resume Optimization**: Provide ATS-specific feedback for better keyword usage.
        - ✅ **Final Recommendation**: A concise summary with suggested improvements.

        Be structured, concise, and provide clear explanations.
    `,
});

async function analyzeResume(resumeText, jobDescription) {
  try {
    // Input validation
    if (!resumeText || typeof resumeText !== "string") {
      throw new Error("Invalid or missing resume text.");
    }
    if (!jobDescription || typeof jobDescription !== "string") {
      throw new Error("Invalid or missing job description.");
    }

    // AI Prompt
    const prompt = `
        Job Description:
        ${jobDescription}

        Candidate's Resume:
        ${resumeText}

        Please evaluate the resume based on the job description and provide feedback in the following format:

        ### 🔍 Matching Skills
        - List the skills from the resume that match the job description.

        ### ⚠️ Missing or Weak Skills
        - Identify skills that are required but not present or underrepresented in the resume.

        ### 📄 Resume Optimization
        - Provide ATS-specific feedback for better keyword usage, formatting, and readability.

        ### ✅ Final Recommendation
        - A concise summary with actionable suggestions for improvement.

        Be specific, structured, and provide clear explanations.
    `;

    // Generate AI response
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text(); // Ensure correct text extraction

    // Validate AI response
    if (!responseText || typeof responseText !== "string") {
      throw new Error("Failed to generate a valid response from the AI.");
    }

    return responseText;
  } catch (error) {
    console.error("❌ Error analyzing resume:", error.message);
    throw new Error("Failed to analyze resume. Please try again.");
  }
}

module.exports = { analyzeResume };
