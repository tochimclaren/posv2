import express from "express";
import userRouter from "./user.router"
import productRouter from "./product.router"
import saleRouter from "./sale.router"
import exchangeRouter from "./exchange.routers"
import healthCheckRouter from "./health.routers"


const router = express.Router()
router.use("/", healthCheckRouter)
router.use("/api/", userRouter)
router.use("/api/", productRouter)
router.use("/api/", saleRouter)
router.use("/api/", exchangeRouter)

export default router