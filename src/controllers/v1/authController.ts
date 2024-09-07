import { Request, Response } from "express";
import { HttpBadRequestHandler, HttpCreatedHandler } from "../../helpers/httpResponseHandler.js";
import { findOneById } from "../../services/v1/userService.js";
import logger from "../../helpers/logger.js";
import { handleError } from "../../helpers/errorHandler.js";
import { generateAuthToken, generateRefreshToken, decodeRefreshToken } from "../../helpers/jwtManager.js";

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken: existingRefreshToken } = req.cookies;

        if (!existingRefreshToken) {
            return HttpBadRequestHandler(res, "No refresh token provided");
        }

        // Decode the refresh token to extract user ID
        const { _id } = decodeRefreshToken(existingRefreshToken);
        const user = await findOneById(_id);
        if (!user || user.refreshToken !== existingRefreshToken) {
            return HttpBadRequestHandler(res, "Invalid refresh token");
        }

        // Generate new JWT and refresh tokens
        const newAuthToken = generateAuthToken({ _id: user._id, username: user.username, email: user.email });
        const newRefreshToken = generateRefreshToken({ _id: user._id });
        user.refreshToken = newRefreshToken;
        await user.save();

        // Set new tokens in cookies
        res.cookie("authToken", newAuthToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        HttpCreatedHandler(res, {
            message: "Token refreshed successfully",
            success: true
        });
    } catch (error: unknown) {
        logger.error(error);
        handleError(res, error);
    }
};
