import { prisma } from "../config/prismaClient";
import cloudinary from "cloudinary"
import fs from "fs/promises"

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
            error: "Failed to load all users." 
        });
    }
}

async function getUserConversations(req: Request, res: Response) {
    try {
        const user = req.user as User;

        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: { id: user.id },
                }
            },
            include: {
                participants: true,
                messages: {
                    take: 1,
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        });

        return res.status(200).json({
            message: "Successfully fetched user's conversations.",
            conversations
        });
    } catch(err: any) {
        console.error("Error in getUserChats: ", err);
        return res.status(500).json({
            error: "Failed to load user's chats." 
        });
    }
}

async function getUserById(
    req: Request<{ userId: string }>, 
    res: Response
) {
    try {
        const { userId } = req.params;

        const profile = await prisma.user.findUnique({
            where: { id: userId },
        });
        if(!profile) return res.status(404).json({ error: "Profile does not exist." });
        
        return res.status(200).json({ 
            profile 
        });
    } catch(err: any) {
        console.error("Error in getUserById: ", err);
        return res.status(500).json({
            error: "Failed to load user's profile."
        })
    }
}

async function searchUserByName(
    req: Request<{}, {}, {}, { name: string }>,
    res: Response
) {
    try {
        const { name } = req.query;

        const users = await prisma.user.findMany({
            where: {
                displayName: {
                    contains: name,
                    mode: "insensitive"
                }
            }
        });

        return res.status(200).json({
            users,
        });
    } catch(err: any) {
        console.error("Error in searchUserByName: ", err);
        return res.status(500).json({
            error: "Failed to find user." 
        });
    }
}

async function updateUserAvatar(
    req: Request, 
    res: Response
) {
    try {
        const avatar = req.file;
        if(!avatar) return res.status(404).json({ error: "Image file not found." });
        
        const user = req.user as User;

        const result = await cloudinary.v2.uploader.upload(avatar.path, {
            public_id: `${user.id}`,
            asset_folder: "devlink/avatars",
            use_asset_folder_as_public_id_prefix: true,
        });
        await fs.unlink(avatar.path);

        const avatarUrl = result.secure_url;
        await prisma.user.update({
            where: { id: user.id },
            data: { avatarUrl }
        });

        return res.status(200).json({
            message: "Successfully updated avatar!",
            avatarUrl,
        });
    } catch(err: any) {
        console.error("Error in updateUser: ", err);
        return res.status(500).json({
            error: "Failed to update user." 
        });
    }
}

export const userController = {
    getAllUsers,
    getUserConversations,
    getUserById,
    searchUserByName,
    updateUserAvatar,
}