import { Request, Response, NextFunction } from "express";
import lodash from 'lodash';
import db from "../../models";

const getUserBySessionToken = async (token: string) => {
    const query = await db.User.findOne({ where: { sessionToken: token } })
    const user = query.toJSON()
    delete user.password
    delete user.salt
    return user
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const sessionToken = req.cookies['AUTH-COOKIE'];

        if (!sessionToken) {
            console.log("missing session token")
            return res.status(400).send({ message: "Login required" })
        }
        const user = await getUserBySessionToken(sessionToken);
        if (!user) {
            return res.sendStatus(400)
        }
        lodash.merge(req, { identity: user })
        next()
    } catch (error) {
        // console.log(error)
        return res.sendStatus(400)
    }
}