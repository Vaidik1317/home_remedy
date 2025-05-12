import dotenv from "dotenv";
dotenv.config();
export const configureBotpress = () => {
    return {
        apiKey: process.env.BOTPRESS_API_KEY,
        botId: process.env.BOTPRESS_BOT_ID,
    };
};
//# sourceMappingURL=botpressConfig.js.map