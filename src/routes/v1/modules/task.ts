import express, { Router } from "express";
import {
    getAllTasks,
    getOneTaskById,
    createNewTask,
    updateOneTask,
    deleteOneTask
} from "../../../controllers/v1/taskController.js";

const router: Router = express.Router();

router.get("/", getAllTasks);
router.post("/:taskId", getOneTaskById);
router.post("/", createNewTask);
router.post("/:taskId", updateOneTask);
router.post("/:taskId", deleteOneTask);

export default router;
