import { Request, Response } from "express";
import { signUpValidation } from "../../validations/signup.js";
import { signInValidation } from "../../validations/signin.js";
import { validate } from "../../utils/zodValidation.js";
import { HttpBadRequestHandler, HttpCreatedHandler } from "../../utils/httpResponseHandler.js";
import { create, findOne } from "../../services/v1/userService.js";
import { hashPassword, comparePassword } from "../../utils/passwordManager.js";
import logger from "../../utils/logger.js";
import { handleError } from "../../utils/errorHandler.js";
import { generateJWT, generateRefreshToken } from "../../utils/jwtManager.js";

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
            message: "User created successfully",
            success: true
        });
    } catch (error: unknown) {
        logger.error(error);
        handleError(res, error);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        // Validate login input
        const validatedResult = validate(body, signInValidation);
        if (validatedResult) {
            return HttpBadRequestHandler(res, validatedResult);
        }

        const { email, password } = body;
        const user = await findOne({ email });
        if (!user) {
            return HttpBadRequestHandler(res, "user not found");
        }

        const validPassword = await comparePassword(password, user.password);
        if (!validPassword) {
            return HttpBadRequestHandler(res, "email or password is wrong");
        }

        const tokenData = {
            _id: user._id,
            username: user.username,
            email: user.email
        };

        const jwtToken = generateJWT(tokenData);
        const refreshToken = generateRefreshToken(user._id.toString());
        await user.save();

        res.cookie("authToken", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        HttpCreatedHandler(res, {
            message: "Login successful",
            success: true
        });
    } catch (error: unknown) {
        logger.error(error);
        handleError(res, error);
    }
};
