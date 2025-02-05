import express from "express";
import userRouter from "./user.router"
import productRouter from "./product.router"
import saleRouter from "./sale.router"


const router = express.Router()

router.use("/api/", userRouter)
router.use("/api/", productRouter)
router.use("/api/", saleRouter)

export default router