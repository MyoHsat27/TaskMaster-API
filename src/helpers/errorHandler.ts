import { Response } from "express";
import { HttpInternalServerErrorHandler } from "./httpResponseHandler.js";

export function sendErrorResponse(res: Response, error: unknown): void {
    HttpInternalServerErrorHandler(res, {
        error: error instanceof Error ? error.message : "An unknown error occurred"
    });
}

export function throwError(error: unknown): never {
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
}
