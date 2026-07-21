import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import fs from "fs";

const JWT_SECRET = process.env.JWT_SECRET || "nfc_super_secret_key_2026";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || (req.headers['x-authorization'] as string);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    fs.appendFileSync('auth-debug.log', `[${new Date().toISOString()}] Missing or invalid header: ${authHeader}\n`);
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    fs.appendFileSync('auth-debug.log', `[${new Date().toISOString()}] Invalid token error: ${error.message} (token: ${token})\n`);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
