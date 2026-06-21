import { prisma } from "../config/prismaClient";

// types
import type { Request, Response } from "express"
import type { User } from "../generated/prisma/client";

async function getAllUsers(req: Request, res: Response) {
    try {
        const users = await prisma.user.findMany();

        return res.status(200).json({
            message: "Successfully fetched all users.",
            users
        });
    } catch(err: any) {
        console.error("Error in getAllUsers: ", err);
        return res.status(500).json({
            error: "Server error fetching all users." 
        });
    }
}

async function getUserChats(req: Request, res: Response) {
    try {
        const user = req.user as User;

        const chats = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: { id: user.id },
                }
            },
            include: {
                participants: true
            }
        });

        return res.status(200).json({
            message: "Successfully fetched user's chats.",
            chats
        });
    } catch(err: any) {
        console.error("Error in getUserChats: ", err);
        return res.status(500).json({
            error: "Server error fetching user's chats." 
        });
    }
}

export const userController = {
    getAllUsers,
    getUserChats
}