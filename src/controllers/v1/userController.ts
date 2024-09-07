import { Request, Response } from "express";
import { signUpValidation } from "../../validations/signup.js";
import { signInValidation } from "../../validations/signin.js";
import { validate } from "../../helpers/zodValidation.js";
import { HttpBadRequestHandler, HttpCreatedHandler } from "../../helpers/httpResponseHandler.js";
import { create, findOne } from "../../services/v1/userService.js";
import { hashPassword, comparePassword } from "../../helpers/passwordManager.js";
import logger from "../../helpers/logger.js";
import { sendErrorResponse } from "../../helpers/errorHandler.js";
import { generateAuthToken, generateRefreshToken } from "../../helpers/jwtManager.js";
import { AuthTokenData } from "../../types/token.js";

export const register = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        // Validate registration input
        const validationResult = validate(body, signUpValidation);
        if (validationResult) {
            return HttpBadRequestHandler(res, validationResult);
        }

        // Check if user already exists
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
        sendErrorResponse(res, error);
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

        // Validate password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return HttpBadRequestHandler(res, "email or password is wrong");
        }

        // Generate tokens
        const authTokenData: AuthTokenData = {
            _id: user._id,
            username: user.username,
            email: user.email
        };
        const authToken = generateAuthToken(authTokenData);
        const refreshToken = generateRefreshToken({ _id: user._id });
        user.refreshToken = refreshToken;
        await user.save();

        // Set tokens into cookies
        res.cookie("authToken", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 day
        });

        HttpCreatedHandler(res, {
            message: "Login successful",
            success: true
        });
    } catch (error: unknown) {
        logger.error(error);
        sendErrorResponse(res, error);
    }
};
