import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { console } from "inspector";
import { log } from "console";
const prisma = new PrismaClient

const createInventory = async (req: Request, res: Response): Promise<any> => {
    try {
        const name: string = req.body.name
        const category: string = req.body.category
        const location: string = req.body.location
        const quantity: number = Number(req.body.quantity);

        const newAttendance = await prisma.items.create({
            data: {
                name,
                category,
                location,
                quantity
            },
        });

        return res.status(201).json({
            status: "success",
            message: "Barang berhasil ditambahkan",
            data: newAttendance
        });

    } catch (error) {
        console.log(error);
        
        res.status(400).json(error);
    }
}

const readInventory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const findInventory = await prisma.items.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!findInventory) {
            return res.status(400).json({
                message: `Item is not found`,
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Data Peminjaman Berhasil Ditemukan",
            data: findInventory
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
        
    }
}

const updateInventory = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;
        const findInventory = await prisma.items.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!findInventory) {
            return res.status(400).json({
                message: `Inventory is not found`,
            });
        }

        const { name, category, location, quantity } = req.body;

        const saveInventory = await prisma.items.update({
            where: {
                id: Number(id),
            },
            data: {
                name: name ?? findInventory?.name,
                category: category ?? findInventory?.category,
                location: location ?? findInventory?.location,
                quantity: quantity ? Number(quantity) : findInventory.quantity,
            },
        });

        return res.status(200).json({
            message: "New inventory has been updated",
            data: saveInventory
        });


    } catch (error) {
        return res.status(500).json(error);
    }
}

const DeleteItem = async (
    req: Request,
    res: Response,
): Promise<any> => {
    try {
        const id = req.params.id;
        const findItem = await prisma.items.findFirst({
            where: {id: Number(id)}
        })
        if(!findItem){
            return res.status(200).json({
                message: "Barang tidak ditemukan"
            })
        }

        const deletedItem = await prisma.items.delete({
            where: {id: Number(id)}
        });

        return res.status(200).json({
            message: `Barang berhasil dihapus`,
            data: deletedItem
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export { createInventory, readInventory, updateInventory, DeleteItem }