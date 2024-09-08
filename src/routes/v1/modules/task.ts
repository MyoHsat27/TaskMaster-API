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

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks with pagination, filtering, and sorting
 *     description: Fetches all tasks for the authenticated user, with options for pagination, filtering by title, status, and priority, and sorting by createdAt, updatedAt, or priority.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of tasks per page.
 *       - in: query
 *         name: filters[title]
 *         schema:
 *           type: string
 *         description: Filter tasks by title (supports partial matches).
 *       - in: query
 *         name: filters[status]
 *         schema:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *         description: Filter tasks by status.
 *       - in: query
 *         name: filters[priority]
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter tasks by priority.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, priority]
 *           default: createdAt
 *         description: Sort tasks by createdAt, updatedAt, or priority.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order (ascending or descending).
 *     responses:
 *       200:
 *         description: A list of tasks with pagination information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pages:
 *                       type: integer
 *                       example: 5
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       401:
 *         description: Unauthorized access, user must be authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 status:
 *                   type: number
 *                   example: 401
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 status:
 *                   type: number
 *                   example: 500
 *     security:
 *       - bearerAuth: []
 */
router.get("/", isAuthenticate, getAllTasks);

/**
 * @swagger
 * /tasks/{taskId}:
 *   get:
 *     summary: Get a task by ID
 *     description: Fetches a single task by its ID for the authenticated user. The task must belong to the user, otherwise, it will return a 404 error.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to retrieve
 *     responses:
 *       200:
 *         description: A task object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized access, user must be authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 status:
 *                   type: number
 *                   example: 401
 *       404:
 *         description: Task not found or does not belong to the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task not found
 *                 status:
 *                   type: number
 *                   example: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 status:
 *                   type: number
 *                   example: 500
 *     security:
 *       - bearerAuth: []
 */
router.get("/:taskId", isAuthenticate, getOneTaskById);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Creates a new task for the authenticated user. The task must have a unique title for the user, and validation is performed on the input fields.
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task.
 *                 example: "Complete the project"
 *               description:
 *                 type: string
 *                 description: Detailed description of the task.
 *                 example: "Finalize the project deliverables and submit it by the end of the day"
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - in-progress
 *                   - completed
 *                 default: pending
 *                 description: The current status of the task.
 *                 example: "in-progress"
 *               priority:
 *                 type: string
 *                 enum:
 *                   - low
 *                   - medium
 *                   - high
 *                 default: medium
 *                 description: The priority level of the task.
 *                 example: "high"
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Task created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request, validation error or task with the same title already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Task already exists"
 *       401:
 *         description: Unauthorized access, user must be authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 status:
 *                   type: number
 *                   example: 401
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 status:
 *                   type: number
 *                   example: 500
 *     security:
 *       - bearerAuth: []
 */
router.post("/", isAuthenticate, createNewTask);

/**
 * @swagger
 * /tasks/{taskId}:
 *   put:
 *     summary: Update a specific task
 *     description: Updates the details of a specific task identified by the `taskId`. The user must be authenticated, and the task must belong to the user. Validation is performed on the input fields.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: The ID of the task to update.
 *         schema:
 *           type: string
 *           example: "64c63c4b6f0a0f10a3d0a9d7"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task.
 *                 example: "Complete the project"
 *               description:
 *                 type: string
 *                 description: Detailed description of the task.
 *                 example: "Finalize the project deliverables and submit it by the end of the day"
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - in-progress
 *                   - completed
 *                 description: The current status of the task.
 *                 example: "in-progress"
 *               priority:
 *                 type: string
 *                 enum:
 *                   - low
 *                   - medium
 *                   - high
 *                 description: The priority level of the task.
 *                 example: "high"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Task updated successfully"
 *       400:
 *         description: Bad request, validation error or task with the same title already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Title already exists"
 *       401:
 *         description: Unauthorized access, user must be authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 status:
 *                   type: number
 *                   example: 401
 *       404:
 *         description: Task not found or user does not own the task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Task not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 status:
 *                   type: number
 *                   example: 500
 *     security:
 *       - bearerAuth: []
 */
router.put("/:taskId", isAuthenticate, updateOneTask);

/**
 * @swagger
 * /tasks/{taskId}:
 *   delete:
 *     summary: Delete a specific task
 *     description: Deletes a specific task identified by the `taskId`. The user must be authenticated, and the task must belong to the user.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: The ID of the task to delete.
 *         schema:
 *           type: string
 *           example: "64c63c4b6f0a0f10a3d0a9d7"
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Task deleted successfully"
 *       401:
 *         description: Unauthorized access, user must be authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 status:
 *                   type: number
 *                   example: 401
 *       404:
 *         description: Task not found or the user does not own the task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Task not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 status:
 *                   type: number
 *                   example: 500
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:taskId", isAuthenticate, deleteOneTask);

export default router;
