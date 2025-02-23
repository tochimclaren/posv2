import { Router } from "express";
import { createSale, getSale, deleteSale, listSale } from "../controllers/sale.controller"
// import { isAuthenticated } from "../middlewares/middleware.auth";
import { saleSchema } from "../schemas/sale.schema";
import { arrayValidation } from "../middlewares/middleware.validation";

const router = Router()


// router.get("/sales", listSale)
// router.post("/sales", isAuthenticated, arrayValidation(saleSchema), createSale)
// router.get("/sales/:id", isAuthenticated, getSale)
// router.delete("/sales/:id", isAuthenticated, deleteSale)


router.get("/sales", listSale)
router.post("/sales", arrayValidation(saleSchema), createSale)
router.get("/sales/:id", getSale)
router.delete("/sales/:id", deleteSale)

export default router