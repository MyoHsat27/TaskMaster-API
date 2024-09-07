import { Response } from "express";
import { HttpInternalServerErrorHandler } from "./httpResponseHandler.js";

export function sendErrorResponse(res: Response, error: unknown): void {
    if (error instanceof Error) {
        HttpInternalServerErrorHandler(res, { error: error.message });
    } else {
        HttpInternalServerErrorHandler(res, { error: "Unknown error occurred" });
    }
}

export function throwError(error: unknown): never {
    if (error instanceof Error) {
        throw new Error(error.message);
    } else {
        throw new Error("An unknown error occurred");
    }
}
