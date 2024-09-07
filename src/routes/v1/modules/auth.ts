import express, { Router } from "express";
import { refreshToken } from "../../../controllers/v1/authController.js";

const router: Router = express.Router();

router.post("/refresh", refreshToken);

export default router;
