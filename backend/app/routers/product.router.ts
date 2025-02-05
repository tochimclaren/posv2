import { Router } from "express"
import { createProduct, updateProduct, deleteProduct, getProduct, listProduct, searchProduct } from "../controllers/product.controller"
import { objectValidation } from "../middlewares/middleware.validation"
import { productSchema } from "../schemas/product.schema"
import { isAuthenticated } from "../middlewares/middleware.auth"

const router = Router()

router.post("/products", isAuthenticated, objectValidation(productSchema), createProduct)
router.put("/products/:id/update", isAuthenticated, objectValidation(productSchema), updateProduct)
router.delete("/products/:id", isAuthenticated, deleteProduct)
router.get("/products/search", searchProduct)
router.get("/products/:id", getProduct)
router.get("/products", listProduct)
export default router