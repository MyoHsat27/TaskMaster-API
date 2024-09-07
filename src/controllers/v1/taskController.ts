import { Request, Response } from "express";
import logger from "../../utils/logger.js";
import { handleError } from "../../utils/errorHandler.js";

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
