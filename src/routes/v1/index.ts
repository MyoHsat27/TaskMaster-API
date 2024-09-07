import express, { Router } from "express";
import users from "./modules/user.js";
import auth from "./modules/auth.js";
import tasks from "./modules/task.js";

const router: Router = express.Router();

router.use("/users", users);
router.use("/auth", auth);
router.use("/tasks", tasks);

export default router;
