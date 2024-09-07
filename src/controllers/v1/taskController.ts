import { Request, Response } from "express";
import logger from "../../helpers/logger.js";
import { handleError } from "../../helpers/errorHandler.js";

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
