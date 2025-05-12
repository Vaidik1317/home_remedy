import { Request, Response, NextFunction } from "express";
import jwt, { Secret, SignOptions, JwtPayload } from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";

interface CustomJWTPayload extends JwtPayload {
  id: string;
  email: string;
}

export const createToken = (id: string, email: string, expiresIn: string) => {
  const payload: CustomJWTPayload = { id, email };
  const secret: Secret = process.env.JWT_SECRET ?? '';
  
  try {
    return jwt.sign(payload, secret, {
      expiresIn: '7d' // Set a fixed expiration time of 7 days
    });
  } catch (error) {
    console.error('Error creating token:', error);
    throw new Error('Failed to create token');
  }
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies?.[COOKIE_NAME] || req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Token Not Received" });
  }

  const secret: Secret = process.env.JWT_SECRET ?? '';
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or Expired Token" });
    }

    res.locals.jwtData = decoded as CustomJWTPayload;
    next();
  });
};
