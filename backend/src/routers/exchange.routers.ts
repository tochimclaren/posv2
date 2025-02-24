import { Router } from "express"
import { getExchange } from "../controllers/exchange.controller"
const router = Router()

router.get("/exchange", getExchange)

export default router