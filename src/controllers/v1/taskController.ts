import { Request, Response } from "express";
import { sendErrorResponse } from "../../helpers/errorHandler.js";
import { validate } from "../../helpers/zodValidation.js";
import { taskCreateValidation } from "../../validations/task/taskCreate.js";
import { taskUpdateValidation } from "../../validations/task/taskUpdate.js";
import {
    HttpBadRequestHandler,
    HttpCreatedHandler,
    HttpFetchedHandler,
    HttpNotFoundHandler
} from "../../helpers/httpResponseHandler.js";
import {
    getTasks,
    getTaskById,
    getTaskByTitle,
    getTaskByUserIdAndTitle,
    createTask,
    updateTask,
    deleteTask
} from "../../services/v1/taskService.js";
import { TaskCreateObject } from "../../types/task.js";
import { transformToObjectId, isValidObjectId } from "../../helpers/helpers.js";

export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.user._id;
        const tasks = await getTasks(userId, req.query);

        return HttpFetchedHandler(res, {
            success: true,
            tasks: tasks.data,
            pagination: tasks.pagination
        });
    } catch (error: unknown) {
        sendErrorResponse(res, error);
    }
};

export const getOneTaskById = async (req: Request, res: Response) => {
    try {
        const taskId = req.params.taskId;
        const userId = res.locals.user._id;

        // Validate taskId
        if (!isValidObjectId(taskId)) {
            return HttpNotFoundHandler(res, "Task not found");
        }

        // Check if the task exists
        const task = await getTaskById(taskId);
        if (!task) {
            return HttpNotFoundHandler(res, "Task not found");
        }

        // Check if the task belongs to the user
        if (task.userId.toString() !== userId.toString()) {
            return HttpNotFoundHandler(res, "Task not found");
        }

        return HttpFetchedHandler(res, {
            data: task,
            success: true
        });
    } catch (error: unknown) {
        sendErrorResponse(res, error);
    }
};

export const createNewTask = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const user = res.locals.user;
        const userId = transformToObjectId(user._id);

        // Validate task create input
        const validationResult = validate(body, taskCreateValidation);
        if (validationResult) {
            return HttpBadRequestHandler(res, validationResult);
        }

        // Check if a task with the same title exists
        const { title, description, status, priority }: TaskCreateObject = body;
        const existingTask = await getTaskByUserIdAndTitle(userId, title);
        if (existingTask && existingTask.userId.toString() === userId.toString()) {
            return HttpBadRequestHandler(res, `Task already exists`);
        }

        // Create the new task
        const newTask = await createTask({ title, description, status, priority, userId });

        return HttpCreatedHandler(res, {
            message: "Task created successfully",
            data: newTask,
            success: true
        });
    } catch (error: unknown) {
        sendErrorResponse(res, error);
    }
};

export const updateOneTask = async (req: Request, res: Response) => {
    try {
        const taskId = req.params.taskId;
        const userId = res.locals.user._id;
        const updatedData = req.body;

        // Validate taskId
        if (!isValidObjectId(taskId)) {
            return HttpNotFoundHandler(res, "Task not found");
        }

        // Validate task update input
        const validationResult = validate(updatedData, taskUpdateValidation);
        if (validationResult) {
            return HttpBadRequestHandler(res, validationResult);
        }

        // Check if the task exists
        const existingTask = await getTaskById(taskId);
        if (!existingTask) {
            return HttpNotFoundHandler(res, "Task not found");
        }

        // Check if a task with the same title exists (excluding current task)
        const anotherTask = await getTaskByTitle(updatedData.title);
        if (
            anotherTask &&
            anotherTask._id.toString() !== taskId.toString() &&
            anotherTask.userId.toString() === userId.toString()
        ) {
            return HttpBadRequestHandler(res, "Title already exists");
        }

        // Check if the task belongs to the user
        if (existingTask.userId.toString() !== userId.toString()) {
            return HttpNotFoundHandler(res, "Task not found");
        }

        // Update the task
        await updateTask(taskId, updatedData);

        return HttpFetchedHandler(res, {
            message: "Task updated successfully",
            success: true
        });
    } catch (error: unknown) {
        sendErrorResponse(res, error);
    }
};

export const deleteOneTask = async (req: Request, res: Response) => {
    try {
        const taskId = req.params.taskId;
        const userId = res.locals.user._id;

        // Validate taskId
        if (!isValidObjectId(taskId)) {
            return HttpNotFoundHandler(res, "Task not found");
        }

        // Check if the task exists
        const existingTask = await getTaskById(taskId);
        if (!existingTask) {
            return HttpNotFoundHandler(res, "Task not found");
        }

        // Check if the task belongs to the user
        if (existingTask.userId.toString() !== userId.toString()) {
            return HttpNotFoundHandler(res, "Task not found");
        }

        // Delete the task
        await deleteTask(taskId);

        return HttpFetchedHandler(res, {
            message: "Task deleted successfully",
            success: true
        });
    } catch (error: unknown) {
        sendErrorResponse(res, error);
    }
};
