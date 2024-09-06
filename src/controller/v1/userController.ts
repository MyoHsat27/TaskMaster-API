import { Request, Response } from "express";
import { signUpValidation } from "../../validations/signup.js";
import { validate } from "../../utils/zodValidation.js";
import { HttpBadRequestHandler } from "../../utils/httpResponseHandler.js";
import { userService } from "../../services/v1/userService.js";
import { hashPassword } from "../../utils/passwordManager";

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
        } catch (error: any) {
            return HttpBadRequestHandler(res, { error: error.message });
        }
    };
    return { register, login };
};
