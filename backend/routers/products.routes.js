import { Router } from "express";
import { createProducts, deleteProducts, getallProducts, updateProduct} from "../controllers/products.controller.js";

const router = new Router();

router.post('/create',createProducts)
router.get('/get', getallProducts)
router.delete('/deleteProduct/:id', deleteProducts)
router.patch('/updateProduct/:id',updateProduct)

export default router;