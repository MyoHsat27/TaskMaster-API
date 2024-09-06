import { Response } from "express";
import { HttpStatus } from "../enums/httpStatus";

function transformMessage(message: string | object) {
    if (typeof message === "string") {
        return { message };
    }
    return message;
}

export function httpExceptionHandler(res: Response, errorMessage: string | object, status: HttpStatus) {
    res.send(status).json({
        errorMessage
    });
}

export function HttpNotFoundHandler(res: Response, message: string | object = "Not Found"): void {
    res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        ...transformMessage(message)
    });
}

export function HttpFetchedHandler(res: Response, message: string | object = "OK"): void {
    res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        ...transformMessage(message)
    });
}

export function HttpCreatedHandler(res: Response, message: string | object = "Created"): void {
    res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        ...transformMessage(message)
    });
}

export function HttpBadRequestHandler(res: Response, message: string | object = "Bad Request"): void {
    res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        ...transformMessage(message)
    });
}

export function HttpUnauthorizedHandler(res: Response, message: string | object = "Unauthorized"): void {
    res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        ...transformMessage(message)
    });
}

export function HttpForbiddenHandler(res: Response, message: string | object = "Forbidden"): void {
    res.status(HttpStatus.FORBIDDEN).json({
        status: HttpStatus.FORBIDDEN,
        ...transformMessage(message)
    });
}

export function HttpMethodNotAllowedHandler(res: Response, message: string | object = "Method Not Allowed"): void {
    res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
        status: HttpStatus.METHOD_NOT_ALLOWED,
        ...transformMessage(message)
    });
}

export function HttpInternalServerErrorHandler(
    res: Response,
    message: string | object = "Internal Server Error"
): void {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        ...transformMessage(message)
    });
}

export function HttpServiceUnavailableHandler(res: Response, message: string | object = "Service Unavailable"): void {
    res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: HttpStatus.SERVICE_UNAVAILABLE,
        ...transformMessage(message)
    });
}
