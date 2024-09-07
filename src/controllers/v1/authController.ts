import { Request, Response } from "express";
import { HttpBadRequestHandler, HttpCreatedHandler } from "../../utils/httpResponseHandler.js";
import { findOneById } from "../../services/v1/userService.js";
import logger from "../../utils/logger.js";
import { handleError } from "../../utils/errorHandler.js";
import { generateJWT, generateRefreshToken, verifyRefreshToken } from "../../utils/jwtManager.js";

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return HttpBadRequestHandler(res, "No refresh token provided");
        }

        const decoded: any = verifyRefreshToken(refreshToken);
        const user = await findOneById(decoded);
        if (!user || user.refreshToken !== refreshToken) {
            return HttpBadRequestHandler(res, "Invalid refresh token");
        }

        const newJWT = generateJWT({ _id: user._id, username: user.username, email: user.email });
        const newRefreshToken = generateRefreshToken(user._id.toString());

        user.refreshToken = newRefreshToken;
        user.save();

        res.cookie("authToken", newJWT, {
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
