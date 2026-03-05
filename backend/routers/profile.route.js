import { Router } from "express";
import { getProfile } from "../controllers/profile.controller.js";


const router = new Router();

router.get('/get', getProfile);

export default router;