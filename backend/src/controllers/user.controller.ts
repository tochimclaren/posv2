import { Request, Response } from "express";
import { authentication, random } from "../helpers/index";
import db from "../../models";


export const loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password } = req.body
        const getUser = await db.User.findOne({
            where: { username: username },
        })

        let data;
        if (!getUser) {
            return res.sendStatus(400)
        }
        const user = getUser.toJSON();
        let passwordHash = null
        if (user.salt) {
            passwordHash = authentication(user.salt, password)
            data = {
                username: user.username,
            }

        } else {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        if (passwordHash && user.password !== passwordHash) {
            return res.sendStatus(403)
        }
        const salt = random()
        getUser.sessionToken = authentication(salt, user.id);
        await getUser.save()
        res.cookie("AUTH-COOKIE", getUser.sessionToken, { maxAge: 6000 * 60, httpOnly: true, secure: false, domain: 'localhost', path: "/" })

        return res.status(200).json(data);

    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }

}

export const getProfile = async (req: Request, res: Response): Promise<any> => {
    try {
        const sessionToken = req.cookies["AUTH-COOKIE"]
        if (sessionToken) {
            const getUser = await db.User.findOne({ where: { sessionToken: sessionToken } })
            if (!getUser) {
                return res.status(400).send({ message: "This user does not exist" })
            }
            const user = getUser.toJSON()
            delete user.password
            delete user.sessionToken
            delete user.salt
            return res.status(200).send(user)
        }
        return res.status(403).send({ message: "Endpoint requires authentication" })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}


export const logoutUser = async (req: Request, res: Response): Promise<any> => {
    res.clearCookie("AUTH-COOKIE");
    return res.status(200).send({ message: "You logged out!" })
}


export const signUp = async (req: Request, res: Response): Promise<any> => {

    try {
        const { username, password, role } = req.body
        const user = await db.User.findOne({
            where: { username },
        });
        if (user) {
            return res.status(403).json({ "message": "Already have an account? Login" })
        }

        const salt = random();
        const newUser = await db.User.create({
            username,
            salt,
            password: authentication(salt, password),
            role,
        })
        const userObj = newUser.toJSON()
        delete userObj.password
        delete userObj.salt
        return res.status(200).json(newUser).end();

    } catch (error) {
        // console.log(error)
        return res.sendStatus(400)
    }
}