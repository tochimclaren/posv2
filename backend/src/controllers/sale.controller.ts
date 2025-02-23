import { Request, Response } from "express"
import db from "../../models"
import { AuthRequest } from "../types/express"


export const createSale = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const user = await db.User.findOne({
            where: {
                sessionToken: req.identity.sessionToken
            }
        })
        if (!user) {
            return res.status(403).json({ message: "Missing user" })
        }
        const data = req.body.data
        const toSave = data.map((item: { quantity: any; price: any; id: any }) => ({
            quantity: item.quantity,
            price: item.price,
            productId: item.id,
            userId: user.id
        }));
        const sale = await db.Sale.bulkCreate(toSave, { validate: true });

        return res.status(200).send(sale)

    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}

export const getSale = async (req: Request, res: Response): Promise<any> => {

    try {
        const { id } = req.params
        if (!id) {
            return res.sendStatus(400)
        }
        const sale = await db.Sale.findOne({
            where: { id: id }
        })
        return res.json(sale)

    } catch (error) {
        // console.log(error)
        return res.sendStatus(500)
    }
}

export const listSale = async (req: Request, res: Response): Promise<any> => {
    try {
        // Extract page and pageSize (limit) from query parameters, with default values
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        // Calculate offset based on current page and pageSize
        const offset = (page - 1) * pageSize;

        // Get the paginated results
        const sale = await db.Sale.findAndCountAll({
            include: [
                {
                    model: db.Product,
                    as: 'product',
                    attributes: ['name']
                },
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['username']
                }
            ],
            limit: pageSize,  // Limit the number of records per page
            offset: offset,   // Offset to start from the correct page
        });

        // Return the paginated results along with additional info (like total pages, current page)
        return res.json({
            data: sale.rows, // Data for the current page
            currentPage: page,
            totalItems: sale.count, // Total number of records
            totalPages: Math.ceil(sale.count / pageSize), // Total number of pages
            pageSize: pageSize
        });

    } catch (error) {
        // console.log(error);
        return res.sendStatus(500);
    }
};

export const deleteSale = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params
        if (!id) {
            return res.sendStatus(400)
        }
        await db.Sale.destroy({
            where: { id: id }
        })
        return res.json({ message: "Sale deleted" })

    } catch (error) {
        // console.log(error)
        return res.sendStatus(500)
    }
}