import jwt from "jsonwebtoken"
import crypto from "crypto"

// config
import { prisma } from "../config/prismaClient.js"

// types
import type { User } from "../generated/prisma/client.js"
import type { Request } from "express"

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY!;

export function issueTokens(user: User) {
    const payload = {
        id: user.id,
        displayName: user.displayName,
        email: user.email
    }

    const accessToken = jwt.sign(
        payload,
        JWT_SECRET_KEY, 
        { expiresIn: "10m" }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        JWT_REFRESH_KEY,
        { expiresIn: "7d" }
    )

    return { accessToken, refreshToken };
}

export function getRefreshHashToken(req: Request) {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return {}

    const hashedToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex")

    return { refreshToken, hashedToken };
}

export async function createSession(userId: string, refreshToken: string) {
    const decoded = jwt.verify(
        refreshToken,
        JWT_REFRESH_KEY
    ) as jwt.JwtPayload;

    const expiresAt = new Date((decoded.exp as number) * 1000);

    const hashedToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex")

    const session = await prisma.session.create({
        data: {
            hashedToken,
            expiresAt,
            userId,
        }
    });
    
    return session;
}

export async function deleteSession(refreshToken: string) {
    if(refreshToken) {
        const hashedToken = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        await prisma.session.deleteMany({
            where: { hashedToken },  
        });
    }
}