import { Response } from "express";
import { HttpInternalServerErrorHandler } from "./httpResponseHandler";

export function handleError(res: Response, error: unknown): void {
    if (error instanceof Error) {
        HttpInternalServerErrorHandler(res, { error: error.message });
    } else {
        HttpInternalServerErrorHandler(res, { error: "Unknown error occurred" });
    }
}
