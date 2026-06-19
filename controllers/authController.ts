import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//config
import { prisma } from "../config/prismaClient";

// services
import { 
    issueTokens, 
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
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .json({
            message: "User successfully signed up!",
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
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .json({
            message: "User successfully logged in!",
            user: userDetails
        });
    } catch(err: any) {
        console.error("Error in login: ", err);
        return res.status(500).json({
            error: "Server error logging in."
        });
    }
};

async function oauthLogin(req: Request, res: Response) {
    try {
        const user = req.user as User;

        const { accessToken, refreshToken } = issueTokens(user);
        const session = await createSession(user.id, refreshToken);
        if(!session) return res.status(400).json({ error: "Failed to create session." });

        return res.status(201)
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .redirect(process.env.CLIENT_URL!);
    } catch(err: any) {
        console.error("Error in oauthLogin: ", err);
        return res.status(500).json({
            error: "Server error logging in."
        });
    }
}

async function logout(req: Request, res: Response) {
    try {
        const refreshToken = req.cookies.refreshToken;
        await deleteSession(refreshToken);
        
        return res.status(200)
        .clearCookie("refreshToken")
        .clearCookie("accessToken")
        .json({
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
        const user = req.user;
        if(!user) return res.status(404).json({ error: "No user found." });
        
        return res.status(200).json({ user });
    } catch(err: any) {
        console.error("Error in getCurrentUser: ", err);
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                error: "Invalid token"
            });
        }
        return res.status(500).json({
            error: "Server error fetching user credentials."
        })
    }
}

async function refresh(req: Request, res: Response) {
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
        .cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .json({ message: "Token refreshed." });
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
    oauthLogin,
    logout,
    getCurrentUser,
    refresh
}