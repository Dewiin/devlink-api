import jwt from "jsonwebtoken"

// types
import type { Request, Response, NextFunction } from "express";

export async function verifyAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers["authorization"];
        if(!authHeader) return res.status(401).json({ error: "Token is missing." });

        const token = authHeader.split(" ")[1];
        if(!token) return res.status(401).json({ error: "Token is missing." });
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
        if (!decoded || typeof decoded !== 'object') return res.status(400).json({ error: 'Token is invalid!' });
        
        next();
    } catch (err: any) {
        console.error("Unexpected error:", err);
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired" });
        }
        return res.status(500).json({ error: "Server error" });
    }    
}