import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the task.
 *           example: "60b6c45f4b1b1a3d0889cf47"
 *         title:
 *           type: string
 *           description: The title of the task.
 *           example: "Complete the project"
 *         description:
 *           type: string
 *           description: Detailed description of the task.
 *           example: "Finalize the project deliverables and submit it by the end of the day"
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - in-progress
 *             - completed
 *           default: pending
 *           description: The current status of the task.
 *           example: "in-progress"
 *         priority:
 *           type: string
 *           enum:
 *             - low
 *             - medium
 *             - high
 *           default: medium
 *           description: The priority level of the task.
 *           example: "high"
 *         userId:
 *           type: string
 *           description: The user ID associated with the task.
 *           example: "60b6c45f4b1b1a3d0889cf48"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time when the task was created.
 *           example: "2023-09-08T14:35:22.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The time when the task was last updated.
 *           example: "2023-09-08T16:21:12.000Z"
 *     TaskCreateInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the task.
 *           example: "Task Title"
 *         description:
 *           type: string
 *           description: A description of the task.
 *           example: "Task Description"
 *         status:
 *           type: string
 *           description: The status of the task.
 *           enum:
 *             - pending
 *             - in-progress
 *             - completed
 *           default: pending
 *         priority:
 *           type: string
 *           description: The priority level of the task.
 *           enum:
 *             - low
 *             - medium
 *             - high
 *           default: medium
 *     TaskUpdateInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - status
 *         - priority
 *       properties:
 *         title:
 *           type: string
 *           description: The updated title of the task.
 *           example: "Updated Task Title"
 *         description:
 *           type: string
 *           description: An updated description of the task.
 *           example: "Updated Task Description"
 *         status:
 *           type: string
 *           description: The updated status of the task.
 *           enum:
 *             - pending
 *             - in-progress
 *             - completed
 *         priority:
 *           type: string
 *           description: The updated priority level of the task.
 *           enum:
 *             - low
 *             - medium
 *             - high
 */
const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title"]
        },
        description: {
            type: String,
            required: [true, "Please provide a description"]
        },
        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending"
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

const Task = mongoose.models.tasks || mongoose.model("tasks", taskSchema);

export default Task;
