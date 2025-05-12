import dotenv from "dotenv";
dotenv.config();
export const configureGemini = () => {
    return {
        apiKey: process.env.GEMINI_API_KEY,
    };
};
//# sourceMappingURL=geminiConfig.js.map