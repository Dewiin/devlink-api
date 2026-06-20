import { prisma } from "../config/prismaClient"

// types
import type { Request, Response } from "express"


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

export const chatController = {
    getGlobalChat
}