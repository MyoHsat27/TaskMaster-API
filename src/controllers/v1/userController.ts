import { Request, Response } from "express";
import { signUpValidation } from "../../validations/signup.js";
import { validate } from "../../utils/zodValidation.js";
import { HttpBadRequestHandler, HttpCreatedHandler } from "../../utils/httpResponseHandler.js";
import { create, findOne } from "../../services/v1/userService.js";
import { hashPassword } from "../../utils/passwordManager";
import logger from "../../utils/logger.js";
import { handleError } from "../../utils/errorHandler.js";

export const register = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        // Validate registration input
        const validationResult = validate(body, signUpValidation);
        if (validationResult) {
            return HttpBadRequestHandler(res, validationResult);
        }

        // Check the existing user
        const { username, email, password } = body;
        const existingUser = await findOne({ email, username });

        if (existingUser) {
            const duplicateField = existingUser.email === email ? "email" : "username";
            return HttpBadRequestHandler(res, `User with this ${duplicateField} already exists`);
        }

        // Register new user
        const hashedPassword = await hashPassword(password);

        await create({ username, email, password: hashedPassword });

        return HttpCreatedHandler(res, {
            responseMessage: "User created successfully",
            success: true
        });
    } catch (error: unknown) {
        logger.error(error);
        handleError(res, error);
    }
};

export const login = async (req: Request, res: Response) => {};
