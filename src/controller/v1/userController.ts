import { Request, Response } from "express";
import { signUpValidation } from "../../validations/signup.js";
import { validate } from "../../utils/zodValidation.js";
import { HttpBadRequestHandler } from "../../utils/httpResponseHandler.js";

export const userController = () => {
    const login = async (req: Request, res: Response) => {};

    const register = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const validationResult = validate(body, signUpValidation);

            if (validationResult) {
                return HttpBadRequestHandler(res, validationResult);
            }
        } catch (error: any) {
            return HttpBadRequestHandler(res, { error: error.message });
        }
    };
    return { register, login };
};
