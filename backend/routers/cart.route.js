import { Router } from "express";
import { addToCart, getCart, removeFromCart, updateQuantity } from "../controllers/cart.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = new Router();

router.post('/add',verifyToken, addToCart);
router.get('/get',verifyToken, getCart);
router.delete('/remove', verifyToken, removeFromCart);
router.patch('/update', verifyToken, updateQuantity);

export default router;