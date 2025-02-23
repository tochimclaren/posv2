
import { Request, Response } from "express"


export const checkHealth = async (req: Request, res: Response): Promise<any> => {
    return res.status(200).send('healthy server...')
}