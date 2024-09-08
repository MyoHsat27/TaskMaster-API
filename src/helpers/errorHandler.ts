import { Response } from "express";
import { HttpInternalServerErrorHandler } from "./httpResponseHandler.js";

export function sendErrorResponse(res: Response, error: unknown): void {
    return HttpInternalServerErrorHandler(res, {
        message: error instanceof Error ? error.message : "An unknown error occurred"
    });
}

export function throwError(error: unknown): never {
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
}
