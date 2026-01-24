import { Router } from "express";
import { createProducts, deleteProducts, getallProducts, updateProduct} from "../controllers/products.controller.js";
import generateBuild from "../controllers/pc.builder.controller.js";

const router = new Router();

router.post('/create',createProducts)
router.get('/get', getallProducts)
router.delete('/deleteProduct/:id', deleteProducts)
router.patch('/updateProduct/:id',updateProduct)
router.post('/build', generateBuild)

export default router;