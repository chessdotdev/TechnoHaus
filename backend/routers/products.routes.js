import { Router } from "express";
import { createProducts } from "../controllers/products.controller.js";

const router = new Router();

router.post('/create',createProducts)

export default router;