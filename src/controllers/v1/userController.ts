import { Request, Response } from "express";
import { signUpValidation } from "../../validations/signup.js";
import { validate } from "../../utils/zodValidation.js";
import { HttpBadRequestHandler, HttpCreatedHandler } from "../../utils/httpResponseHandler.js";
import { userService } from "../../services/v1/userService.js";
import { hashPassword } from "../../utils/passwordManager.js";
import { handleError } from "../../utils/errorHandler.js";

const { findOne, create } = userService();

export const userController = () => {
    const login = async (req: Request, res: Response) => {};

    const register = async (req: Request, res: Response) => {
        try {
            const body = req.body;

            // Validate registration input
            const validationResult = validate(body, signUpValidation);
            if (validationResult) {
                return HttpBadRequestHandler(res, validationResult);
            }

            // Check the existing user
            const { username, email, password } = body;
            const user = await findOne({ email });
            if (user) {
                return HttpBadRequestHandler(res, "user already exists");
            }

            // Register new user
            const hashedPassword = await hashPassword(password);

            await create({ username, email, password: hashedPassword });

            return HttpCreatedHandler(res, {
                responseMessage: "User created successfully",
                success: true
            });
        } catch (error: unknown) {
            handleError(res, error);
        }
    };
    return { register, login };
};
