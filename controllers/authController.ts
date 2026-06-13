import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//config
import { prisma } from "../config/prismaClient";

// services
import { issueTokens, createSession, deleteSession } from "../services/auth";

// types
import type { Request, Response } from "express";

async function signup(req: Request, res: Response) {
    try {
        const { displayName, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                displayName,
                email,
                password: hashedPassword,
                provider: "LOCAL"
            }
        });

        const { accessToken, refreshToken } = issueTokens(user);
        const session = await createSession(user.id, refreshToken);
        if(!session) return res.status(400).json({ error: "Failed to create session." });

        const userDetails = {
            id: user.id,
            displayName: user.displayName,
            email: user.email
        }

        return res.status(201)
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .json({
            message: "User successfully signed up!",
            accessToken,
            user: userDetails
        });
    } catch(err: any) {
        console.error("Error in signup: ", err);
        return res.status(500).json({
            error: "Server error signing up."
        });
    }
};

async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });
        if(!user) return res.status(404).json({ error: "Email or password is incorrect." });
        if(!user.password) return res.status(403).json({ error: "This email is associated with a google acccount." });

        const match = bcrypt.compare(password, user.password);
        if(!match) return res.status(403).json({ error: "Email or password is incorrect" });

        const { accessToken, refreshToken } = issueTokens(user);
        const session = await createSession(user.id, refreshToken);
        if(!session) return res.status(400).json({ error: "Failed to create session." });

        const userDetails = {
            id: user.id,
            displayName: user.displayName,
            email: user.email
        }

        return res.status(201)
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .json({
            message: "User successfully logged in!",
            accessToken,
            user: userDetails
        });
    } catch(err: any) {
        console.error("Error in login: ", err);
        return res.status(500).json({
            error: "Server error logging in."
        });
    }
};

async function logout(req: Request, res: Response) {
    try {
        const refreshToken = req.cookies.refreshToken;
        await deleteSession(refreshToken);
        
        res.clearCookie("refreshToken");
        return res.status(200).json({
            message: "User successfully logged out!"
        });
    } catch(err: any) {
        console.error("Error in signup: ", err);
    }
};

async function getCurrentUser(req: Request, res: Response) {
    const authHeader = req.headers["authorization"];
    if(!authHeader) return res.status(400).json({ error: "Token is missing." })

    const accessToken = authHeader.split(" ")[1];
    if(!accessToken) return res.status(401).json({ error: "Token is missing." });

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY!);
    
    return res.status(200).json({ user: decoded });
}

export const authController = {
    signup,
    login,
    logout,
    getCurrentUser,
}