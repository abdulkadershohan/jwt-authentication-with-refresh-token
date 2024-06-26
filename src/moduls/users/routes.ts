import express from "express";
import { authGuard } from "../../middlewares/authGuard";
import { login, logout, profile, signup } from "./controller";

const router = express.Router();
router.get("/", authGuard, profile)
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
export default router;