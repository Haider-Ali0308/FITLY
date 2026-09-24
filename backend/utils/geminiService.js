// utils/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with an environment variable
const genAI = new GoogleGenerativeAI("AIzaSyDXpbcAgXJB4ly0uwc5zgnRemQRRzHnIz0");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Generate content using Google's Gemini AI model
 * @param {string} prompt - The prompt to send to Gemini
 * @returns {Promise<string>} - The generated text response
 */
export const generateContent = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return response;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate content from AI");
  }
};
