import jwt from "jsonwebtoken"
import crypto from "crypto"

// config
import { prisma } from "../config/prismaClient"

// types
import type { User } from "../generated/prisma/client"

export function issueTokens(user: User) {
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

    return { accessToken, refreshToken };
}

export async function createSession(userId: string, refreshToken: string) {
    const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_KEY!
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