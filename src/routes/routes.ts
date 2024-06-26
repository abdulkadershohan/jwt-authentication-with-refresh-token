import express from "express";
import UserRoutes from "../moduls/users/routes";

const router = express.Router();
// user routes
router.use("/user", UserRoutes);

export default router;