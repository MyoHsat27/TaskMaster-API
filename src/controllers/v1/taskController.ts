import { Request, Response } from "express";
import logger from "../../helpers/logger.js";
import { handleError } from "../../helpers/errorHandler.js";
import { validate } from "../../helpers/zodValidation.js";
import { taskCreateValidation } from "../../validations/task/taskCreate.js";
import { HttpBadRequestHandler, HttpCreatedHandler } from "../../helpers/httpResponseHandler.js";
import { getTaskByTitle, createTask } from "../../services/v1/taskService.js";
import { TaskCreateObject } from "../../types/task.js";
import { UserObject } from "../../types/user.js";
import { transformToObjectId } from "../../helpers/mongoHelper.js";

export const getAllTasks = async (req: Request, res: Response) => {
    try {
        res.send(req.query);
    } catch (error: unknown) {
        logger.error(error);
        handleError(res, error);
    }
};
export const getOneTaskById = async (req: Request, res: Response) => {
    try {
    } catch (error: unknown) {
        logger.error(error);
        handleError(res, error);
    }
};
export const createNewTask = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const user = req.user as UserObject;
        const userId = transformToObjectId(user._id);

        // Validate task create input
        const validationResult = validate(body, taskCreateValidation);
        if (validationResult) {
            return HttpBadRequestHandler(res, validationResult);
        }

        // Check if task already existss
        const { title, description, status, priority }: TaskCreateObject = body;
        const existingTask = await getTaskByTitle(title);
        if (existingTask) {
            return HttpBadRequestHandler(res, `Task already exists`);
        }

        // Create the new task
        const newTask = await createTask({ title, description, status, priority, userId });

        return HttpCreatedHandler(res, {
            message: "Task created successfully",
            data: existingTask,
            success: true
        });
    } catch (error: unknown) {
        logger.error(error);
        handleError(res, error);
    }
};
export const updateOneTask = async (req: Request, res: Response) => {
    try {
    } catch (error: unknown) {
        logger.error(error);
        handleError(res, error);
    }
};
export const deleteOneTask = async (req: Request, res: Response) => {
    try {
    } catch (error: unknown) {
        logger.error(error);
        handleError(res, error);
    }
};
