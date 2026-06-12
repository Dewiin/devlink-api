import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

//config
import { prisma } from "../config/prismaClient";

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

        const payload = {
            id: user.id,
            displayName: user.displayName,
            email: user.email
        }
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY!, 
            { expiresIn: "10m" }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_SECRET_KEY!,
            { expiresIn: "7d" }
        )
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET_KEY!
        ) as jwt.JwtPayload;
        const expiresAt = new Date((decoded.exp as number) * 1000);

        const hashedToken = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex")

        await prisma.session.create({
            data: {
                hashedToken,
                expiresAt,
                userId: user.id
            }
        });


        return res.status(201)
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .json({
            message: "User successfully signed up!",
            accessToken,
            user: payload
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

    } catch(err: any) {
        console.error("Error in signup: ", err);
    }
};

async function logout(req: Request, res: Response) {
    try {

    } catch(err: any) {
        console.error("Error in signup: ", err);
    }
};

export const authController = {
    signup,
    login,
    logout
}