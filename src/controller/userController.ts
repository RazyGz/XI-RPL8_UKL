import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import { log } from "console";
import { resolveTxt } from "dns";
// import { Role } from "@prisma/client"; // Pastikan import enum Role jika ada
// import { emitWarning } from "process";

const prisma = new PrismaClient({ errorFormat: "minimal" });

type roleType = "ADMIN" | "USER"

const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password, email, role } = req.body as { username: string, password: string , email: string , role: roleType};

        // Cek apakah username sudah ada
        const findUsername = await prisma.user.findFirst({
            where: { username },
        });
        if (findUsername) {
            res.status(400).json({
                message: `Username already exists`,
            });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat user baru
        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                password: String(hashedPassword),
                role, // Gunakan Role.USER jika role adalah enum
            },
        });

        res.status(200).json({
            message: `User has been created`,
            data: newUser,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: `An error occurred while creating the user`,
            error: `error.message || Internal Server Error`,
        });
    }
}

const readUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = req.query.search?.toString() || null;

        const allData = await prisma.user.findMany({
            where: search
                ? {
                    username: { contains: search },
                }
                : undefined, // Tidak ada kondisi `where` jika `search` kosong
        });

        res.status(200).json({
            message: `Users have been retrieved`,
            data: allData,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;

        const findUserId = await prisma.user.findFirst({
            where: { id: Number(id) },
        });

        if (!findUserId) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }

        const { email, password } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                email: email ?? findUserId.email,
                password: password
                    ? await bcrypt.hash(password, 12)
                    : findUserId.password,
            },
        });

        res.status(200).json({
            message: "User updated",
            data: updatedUser,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteUser = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const id = req.params.id;

        const findUser = await prisma.user.findFirst({
            where: {
                id: Number(id)
            }
        })

        if (!findUser){
            return res.status(400).json({
                message: "User tidak ditemukan"
            }
            )
        }

        const deleteUser = await prisma.user.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json({
            message: `User berhasil dihapus`,
            data: deleteUser
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

/** Function for login(authentication) */
const authentication = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, username, role } = req.body

        // Check existing username
        const findUser = await prisma.user.findUnique({ where: { email } });
        if (!findUser) {
            res.status(400).json({
                message: "Username is not registered",
            });
            return;
        }

        const isMatchPassword = await bcrypt.compare(password, findUser.password);
        if (!isMatchPassword) {
            res.status(400).json({
                message: "Invalid password",
            });
            return;
        }

        /** Prepare to generate token using JWT */
        const payload = {
            username: findUser?.username,
            password: findUser?.password,
            email: findUser?.email,
            Role: findUser?.role,
        };
        const signature = process.env.SECRET || ``;

        const token = jwt.sign(payload, signature);

        res.status(200).json({
            status: "success",
            message: `Login successful`,
            token,
            email: findUser?.email
        });
    } catch (error) {
        console.log(error);
        
        res.status(500).json(error);
    }
};

export { createUser, readUser, updateUser, deleteUser, authentication };