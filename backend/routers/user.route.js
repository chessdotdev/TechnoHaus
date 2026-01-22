import { Router } from "express";
import { createUser, loginUser, logoutUser } from "../controllers/auth.controller.js";
const router = new Router();

router.post('/register', createUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)


export default router;