import { Request, Response } from "express";
import { authentication, random } from "../helpers/index";
import db from "../../models";


export const loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password } = req.body
        const getUser = await db.User.findOne({
            where: { username: username },
        })
        const user = getUser.toJSON();
        let data;
        if (!user) {
            return res.sendStatus(400)
        }
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
        if (!username || !password) {

            console.log("here?")
            return res.sendStatus(400)
        }

        console.log("in signup")
        const user = await db.User.findOne({
            where: { username },
        });
        if (user) {
            return res.json({ "message": "Already have an account? Login" })
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
        console.log(error)
        return res.sendStatus(400)
    }
}

// export const updateUser = async (req: Request, res: Response): Promise<any> => {
//     try {
//         const { userId } = req.params
//         const { role } = req.body
//         if (!userId) {
//             return res.status(400).send({ "message": "query param missing user id" })
//         }
//         const [updatedRowsCount] = await db.User.update(
//             {
//                 role: role
//             },
//             {
//                 where: { id: userId },
//             }
//         );
//         if (updatedRowsCount === 0) {
//             console.log('No user found with the given ID.');
//         } else {
//             console.log('User updated successfully.');
//         }
//     } catch (error) {
//         console.log(error)
//         return res.sendStatus(500)
//     }
// }