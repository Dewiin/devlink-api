import { prisma } from "../config/prismaClient"

// types
import type { Request, Response } from "express"
import type { User } from "../generated/prisma/client";

async function getGlobalChat(req: Request, res: Response) {
    try {
        const globalChat = await prisma.conversation.findUnique({
            where: {
                id: "globalChat"
            }
        });
        
        return res.status(200).json({
            message: "Fetched global chat successfully!",
            globalChat
        });
    } catch(err: any) {
        console.error("Error in getGlobalChat: ", err);
        return res.status(500).json({
            error: "Server error fetching global chat."
        });
    }
}

async function postGlobalChat(req: Request, res: Response) {
    try {
        const { content } = req.body;
        const user = req.user as User;
        if(!user) return res.status(401).json({ error: "User is not authenticated." });

        const message = await prisma.message.create({
            data: {
                content,
                senderId: user.id,
                conversationId: "globalChat"
            }
        });
        
        return res.status(201).json({
            message,
        });
    } catch(err: any) {
        console.error("Error in postGlobalChat: ", err);
        return res.status(500).json({
            error: "Message failed to send."
        });
    }
}

export const chatController = {
    getGlobalChat,
    postGlobalChat
}