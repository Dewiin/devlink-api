import { prisma } from "../config/prismaClient";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// types
import type { Request, Response } from "express";

async function signup(req: Request, res: Response) {
    try {
        const { displayName, email, password } = req.body;
        
    } catch(err: any) {
        console.error("Error in signup: ", err);
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