import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import "./App.css";

function ErrorBoundary({ children }) {
  try {
    return children;
  } catch (error) {
    console.error("Error rendering Markdown:", error);
    return <p className="text-red-400">Error displaying content.</p>;
  }
}

function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [review, setReview] = useState("Waiting for submission...");

  const handleFileChange = (event) => {
    setResume(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!resume || !jobDescription) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await axios.post(
        "http://localhost:3000/ai/analyze-resume",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setReview(response.data.review);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setReview("Error processing resume. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="w-full max-w-5xl bg-gray-800 p-10 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Section - Input Fields */}
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center mb-6">
            Resume Analyzer
          </h1>

          <div className="space-y-4">
            <label className="block text-lg font-medium">
              Upload Resume (PDF)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full bg-gray-700 p-3 rounded-lg text-white file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-lg font-medium">Job Description</label>
            <textarea
              placeholder="Enter job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-48 bg-gray-700 p-4 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Analyze Resume
          </button>
        </div>

        {/* Right Section - Review Output */}
        <div className="bg-gray-700 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Review:</h2>
          <ErrorBoundary>
            <div className="text-gray-300 text-lg markdown-content">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={{
                  // Paragraphs
                  p: ({ node, ...props }) => (
                    <p {...props} className="mb-4 leading-relaxed" />
                  ),
                  // Bold text
                  strong: ({ node, ...props }) => (
                    <strong {...props} className="font-bold text-blue-400" />
                  ),
                  // Unordered lists
                  ul: ({ node, ...props }) => (
                    <ul {...props} className="list-disc pl-6 mb-4" />
                  ),
                  // Ordered lists
                  ol: ({ node, ...props }) => (
                    <ol {...props} className="list-decimal pl-6 mb-4" />
                  ),
                  // List items
                  li: ({ node, ...props }) => (
                    <li {...props} className="mb-2" />
                  ),
                  // Headings
                  h1: ({ node, ...props }) => (
                    <h1
                      {...props}
                      className="text-3xl font-bold mb-6 border-b-2 border-gray-600 pb-2"
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      {...props}
                      className="text-2xl font-bold mb-4 border-b-2 border-gray-600 pb-2"
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 {...props} className="text-xl font-bold mb-4" />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4 {...props} className="text-lg font-bold mb-3" />
                  ),
                  // Code blocks
                  code: ({ node, ...props }) => (
                    <code
                      {...props}
                      className="bg-gray-800 p-1 rounded text-sm font-mono"
                    />
                  ),
                  pre: ({ node, ...props }) => (
                    <pre
                      {...props}
                      className="bg-gray-800 p-4 rounded-lg overflow-x-auto my-4"
                    />
                  ),
                  // Links
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-blue-400 hover:text-blue-300 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                  // Blockquotes
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      {...props}
                      className="border-l-4 border-blue-400 pl-4 my-4 italic text-gray-400"
                    />
                  ),
                  // Tables
                  table: ({ node, ...props }) => (
                    <table
                      {...props}
                      className="w-full border-collapse border border-gray-600 my-4"
                    />
                  ),
                  th: ({ node, ...props }) => (
                    <th
                      {...props}
                      className="border border-gray-600 p-2 bg-gray-800 font-bold"
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td {...props} className="border border-gray-600 p-2" />
                  ),
                }}
              >
                {review || "Processing review..."}
              </ReactMarkdown>
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default App;
