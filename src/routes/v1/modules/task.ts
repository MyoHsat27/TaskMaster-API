import express, { Router } from "express";
import {
    getAllTasks,
    getOneTaskById,
    createNewTask,
    updateOneTask,
    deleteOneTask
} from "../../../controllers/v1/taskController.js";
import isAuthenticate from "../../../middlewares/isAuthenticate.js";

const router: Router = express.Router();

router.get("/", isAuthenticate, getAllTasks);
router.get("/:taskId", isAuthenticate, getOneTaskById);
router.post("/", isAuthenticate, createNewTask);
router.put("/:taskId", isAuthenticate, updateOneTask);
router.delete("/:taskId", isAuthenticate, deleteOneTask);

export default router;
