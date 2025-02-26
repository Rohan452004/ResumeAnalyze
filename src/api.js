const BASE_URL = import.meta.env.VITE_BASE_URL;
console.log("BASE_URL:", BASE_URL);

export const API_ENDPOINTS = {
  ANALYZE_RESUME: `${BASE_URL}/ai/analyze-resume`,
};
