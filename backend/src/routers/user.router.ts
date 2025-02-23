import { Router } from "express";
import { loginUser, logoutUser, signUp, getProfile } from "../controllers/user.controller";
import { objectValidation } from "../middlewares/middleware.validation";
import { userLoginSchema, userSchema } from "../schemas/user.schema";

const router = Router()


router.post("/login", objectValidation(userLoginSchema), loginUser)
router.post("/signup", objectValidation(userSchema), signUp)
router.get("/profile", getProfile)
router.post("/logout", logoutUser)

export default router
