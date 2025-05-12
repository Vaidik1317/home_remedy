import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";
export const createToken = (id, email, expiresIn) => {
    const payload = { id, email };
    const secret = process.env.JWT_SECRET ?? '';
    try {
        return jwt.sign(payload, secret, {
            expiresIn: '7d' // Set a fixed expiration time of 7 days
        });
    }
    catch (error) {
        console.error('Error creating token:', error);
        throw new Error('Failed to create token');
    }
};
export const verifyToken = (req, res, next) => {
    const token = req.signedCookies?.[COOKIE_NAME] || req.cookies?.[COOKIE_NAME];
    if (!token) {
        return res.status(401).json({ message: "Token Not Received" });
    }
    const secret = process.env.JWT_SECRET ?? '';
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid or Expired Token" });
        }
        res.locals.jwtData = decoded;
        next();
    });
};
//# sourceMappingURL=token-manager.js.map