import { prisma } from "../config/prismaClient";
import cloudinary from "cloudinary"
import bcrypt from "bcryptjs";
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
        console.error("Error in updateUserAvatar: ", err);
        return res.status(500).json({
            error: "Failed to update user avatar." 
        });
    }
}

async function updateUserBanner(
    req: Request,
    res: Response
) {
    try {
        const banner = req.file;
        if(!banner) return res.status(404).json({ error: "Image file not found." });
        
        const user = req.user as User;

        const result = await cloudinary.v2.uploader.upload(banner.path, {
            public_id: `${user.id}`,
            asset_folder: "devlink/banners",
            use_asset_folder_as_public_id_prefix: true,
        });
        await fs.unlink(banner.path);

        const bannerUrl = result.secure_url;
        await prisma.user.update({
            where: { id: user.id },
            data: { bannerUrl }
        });

        return res.status(200).json({
            message: "Successfully updated banner!",
            bannerUrl,
        });
    } catch(err: any) {
        console.error("Error in updateUserBanner: ", err);
        return res.status(500).json({
            error: "Failed to update user banner." 
        });
    }
}

async function updateUserProfile(
    req: Request,
    res: Response
) {
    try {
        const { displayName, bio } = req.body;
        const user = req.user as User;

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                displayName,
                bio
            }
        });

        return res.status(200).json({
            message: "Successfully updated profile!",
        });
    } catch(err: any) {
        console.error("Error in updateUserProfile: ", err);
        return res.status(500).json({
            error: "Failed to update user profile."
        });
    }
}

async function updateUserPassword(
    req: Request,
    res: Response
) {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = req.user as User;

        const updateUser = await prisma.user.findUnique({
            where: { id: user.id },
        });
        if(!updateUser) return res.status(401).json({ error: "User is not authenticated." });
        if(!updateUser.password) return res.status(400).json({ error: "Account is associated with Google or GitHub." });
        
        const match = bcrypt.compare(oldPassword, updateUser.password);
        if(!match) return res.status(403).json({ error: "Password is incorrect." });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        return res.status(200).json({
            message: "Password successfully updated!"
        });
    } catch(err: any) {
        console.error("Error in updateUserPassword: ", err);
        return res.status(500).json({
            error: "Failed to update user password."
        });
    }
}

export const userController = {
    getAllUsers,
    getUserConversations,
    getUserById,
    searchUserByName,
    updateUserAvatar,
    updateUserBanner,
    updateUserProfile,
    updateUserPassword
}