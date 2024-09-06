import express, { Router, Request, Response } from "express";
import { userController } from "../../../controller/v1/userController.js";

const router: Router = express.Router();
const { register, login } = userController();

router.post("/register", register);
router.post("/login", login);

export default router;
