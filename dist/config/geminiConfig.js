import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();
export const configureGemini = () => {
    const apiKey = process.env.GEMINI_API_KEY || "";
    const ai = new GoogleGenAI({ apiKey });
    return { apiKey, ai };
};
//# sourceMappingURL=geminiConfig.js.map