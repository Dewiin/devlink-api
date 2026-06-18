import { prisma } from "../config/prismaClient";

// types
import type { Request, Response } from "express"

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

export const userController = {
    getAllUsers,
}