import { prisma } from "../config/prismaClient"

// types
import type { Request, Response } from "express"
import type { User } from "../generated/prisma/client";

async function getGlobalChat(req: Request, res: Response) {
    try {
        const globalChat = await prisma.conversation.findUnique({
            where: {
                id: "globalChat"
            },
            include: {
                messages: {
                    include: {
                        sender: true
                    }
                }
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

        const message = await prisma.message.create({
            data: {
                content,
                senderId: user.id,
                conversationId: "globalChat"
            },
            include: {
                sender: true
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

async function getChatByRecipientId(
    req: Request<{ recipientId: string }>, 
    res: Response
) {
    try {
        const { recipientId } = req.params;
        const user = req.user as User;

        let conversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    {
                        participants: {
                            some: { id: recipientId }
                        }
                    },
                    {
                        participants: {
                            some: { id: user.id }
                        }
                    }
                ]
            },
            include: {
                messages: {
                    include: { sender: true },
                    orderBy: { createdAt: "asc" }
                },
                participants: true,
            }
        });

        if(!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participants: {
                        connect: [
                            { id: user.id },
                            { id: recipientId }
                        ]
                    }
                },
                include: {
                    messages: {
                        include: { sender: true },
                        orderBy: { createdAt: "asc" }   
                    },
                    participants: true,
                }
            });
        }

        return res.status(200).json({
            message: "Successfully fetched chat.",
            conversation
        });
    } catch(err: any) {
        console.error("Error in getChatByUserId: ", err);
        return res.status(500).json({
            error: "Chat failed to load."
        })
    }
}

export const chatController = {
    getGlobalChat,
    postGlobalChat,
    getChatByRecipientId
}