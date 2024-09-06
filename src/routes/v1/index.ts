import express, { Router } from "express";
import users from "./modules/user.js";

const router: Router = express.Router();

router.use("/users", users);

export default router;
