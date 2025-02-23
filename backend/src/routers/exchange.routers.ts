import { Router } from "express"
import { getExchange } from "../controllers/exchange.controller"
const router = Router()

router.post("/exchange", getExchange)

export default router