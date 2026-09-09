import User from "../models/User.js";
import { configureGemini } from "../config/geminiConfig.js";
// Load Gemini API configuration
const { apiKey: GEMINI_API_KEY, ai } = configureGemini();
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        if (!GEMINI_API_KEY || !ai) {
            return res.status(500).json({ message: "Gemini API key is missing" });
        }
        const remidi_Message = `
    IMPORTANT: You are a home remedy expert chatbot.
    You must only answer questions that are directly related to home remedies using natural or traditional methods.
    If the user asks about ANYTHING else — like tech, health diagnosis, AI, programming, or general knowledge — you must politely decline and say: 
    "I'm sorry, I can only help with home remedies."
    
    NEVER break this rule. Do not explain this restriction unless asked. The next message is from the user:
    `;
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: remidi_Message + message,
        });
        const botMessage = response.text || "No response received";
        // Save chat history to user if user exists
        if (res.locals.jwtData?.id) {
            const user = await User.findById(res.locals.jwtData.id);
            if (user) {
                user.chats.push({ role: "user", content: message });
                user.chats.push({ role: "assistant", content: botMessage });
                await user.save();
                return res.status(200).json({ response: botMessage, chats: user.chats });
            }
        }
        return res.status(200).json({ response: botMessage });
    }
    catch (error) {
        console.error("Gemini API Error:", error);
        return res.status(500).json({
            message: "Gemini API error",
            error: error?.message,
        });
    }
};
export const sendChatsToUser = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        return res.status(200).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "ERROR", cause: error?.message });
    }
};
export const deleteChats = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        // user.chats = [];
        await user.save();
        return res.status(200).json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "ERROR", cause: error?.message });
    }
};
//# sourceMappingURL=chat-controllers.js.map