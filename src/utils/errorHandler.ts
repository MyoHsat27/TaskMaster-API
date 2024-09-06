import { Response } from "express";
import { HttpBadRequestHandler } from "./httpResponseHandler";

export function handleError(res: Response, error: unknown): void {
    if (error instanceof Error) {
        HttpBadRequestHandler(res, { error: error.message });
    } else {
        HttpBadRequestHandler(res, { error: "Unknown error occurred" });
    }
}
