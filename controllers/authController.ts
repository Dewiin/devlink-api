import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//config
import { prisma } from "../config/prismaClient";

// services
import { 
    issueTokens, 
    getAccessToken,
    getRefreshHashToken,
    createSession, 
    deleteSession, 
} from "../services/auth";

// types
import type { Request, Response } from "express";
import type { User } from "../generated/prisma/client";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY!;

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
        const user = req.user as User;

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
        console.error("Error in logout: ", err);
        return res.status(500).json({
            error: "Server error logging out."
        });
    }
};

async function getCurrentUser(req: Request, res: Response) {
    try {
        const accessToken = getAccessToken(req);
        if(!accessToken) return res.status(404).json({ error: "Token is missing." })
    
        const decoded = jwt.verify(accessToken, JWT_SECRET_KEY);
        
        return res.status(200).json({ user: decoded });
    } catch(err: any) {
        console.error("Error in getCurrentUser: ", err);
        return res.status(500).json({
            error: "Server error fetching user credentials."
        })
    }
}

async function refreshToken(req: Request, res: Response) {
    try {
        const { refreshToken, hashedToken } = getRefreshHashToken(req);
        if(!hashedToken) return res.status(404).json({ error: "Refresh token is missing." });

        const payload = jwt.verify(
            refreshToken,
            JWT_REFRESH_KEY
        ) as jwt.JwtPayload;
        const session = await prisma.session.findFirst({
            where: {
                hashedToken,
                userId: payload.id
            },
            include: { user: true }
        });
        if(!session) return res.status(404).json({ error: "Session not found." });
        
        // issue new refresh token
        await deleteSession(refreshToken);
        const tokens = issueTokens(session.user);
        const newSession = await createSession(session.userId, tokens.refreshToken);
        if(!newSession) return res.status(400).json({ error: "Failed to create session." });
        
        return res.status(200)
        .cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .json({
            accessToken: tokens.accessToken 
        })
    } catch(err: any) {
        console.error("Error in refreshToken: ", err);
        return res.status(500).json({
            error: "Server error renewing session."
        });
    }
}

export const authController = {
    signup,
    login,
    logout,
    getCurrentUser,
    refreshToken
}