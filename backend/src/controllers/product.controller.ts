import { Request, Response } from "express";
import { AuthRequest } from "../types/express";
import { Op } from "sequelize";
import db from "../../models";
import { paginateProduct } from "../utilities/pagination"


export const getProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params
        const product = await db.Product.findOne({
            where: { id: id }
        })
        if (product) {
            return res.status(200).json(product)
        }
        else {
            return res.sendStatus(404)
        }
    }
    catch (error) {
        // console.log(error)
        res.sendStatus(500)
    }
}

export const listProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const page: number = parseInt(req.query.page as string) || 1;
        const pageSize: number = parseInt(req.query.pageSize as string) || 10;
        const products = await paginateProduct(page, pageSize)
        return res.json(products)
    }
    catch (error) {
        // console.log(error)
        return res.sendStatus(500)
    }
}


export const createProduct = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { name, price, isAvailable } = req.body
        console.log(req.body)
        if (!name || !price) {
            return res.status(403).json({ message: "One or more missing attributes" })
        }
        const sessionToken = req.identity.sessionToken
        if (!sessionToken) {
            return res.status(403).json({ message: "User must be logged in" })
        }
        const user = await db.User.findOne({
            where: {
                sessionToken: req.identity.sessionToken
            }
        })
        console.log(name, price, isAvailable)
        const product = await db.Product.create({
            name,
            price,
            isAvailable
        })
        await product.setUser(user)
        return res.json(product)
    } catch (error) {

        console.log(error)
        return res.sendStatus(500)
    }

}


export const updateProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, price, isAvailable } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Missing product ID in params" });
        }
        if (!name || !price) {
            return res.status(400).json({ message: "Missing attributes" });
        }

        const product = await db.Product.findByPk({ where: { id } });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.update({ name, price, isAvailable });

        return res.status(200).json(product);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params
        if (!id) {
            return res.json({ message: "missing parameter id" })
        }
        const product = await db.Product.destroy({ where: { id: id } })
        return res.json({ product: product, message: `${product} Deleted` })

    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}


export const searchProduct = async (req: Request, res: Response): Promise<any> => {
    // TODO: need more work
    const { q } = req.query
    const products = await db.Product.findAll({
        where: {
            name: {
                [Op.like]: `%${q}%`,
            },
        },
    });
    return res.status(200).json(products)
}