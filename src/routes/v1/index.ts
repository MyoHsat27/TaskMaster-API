import express, { Router } from "express";
import users from "./modules/user.js";
import auth from "./modules/auth.js";

const router: Router = express.Router();

router.use("/users", users);
router.use("/auth", auth);

export default router;
