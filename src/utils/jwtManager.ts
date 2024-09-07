import jsonwebtoken from "jsonwebtoken";
import logger from "./logger.js";

export const generateJWT = (tokenData: object, options?: jsonwebtoken.SignOptions) => {
    return jsonwebtoken.sign(tokenData, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_TTL!,
        ...(options && options)
    });
};

export const generateRefreshToken = (tokenData: object, options?: jsonwebtoken.SignOptions) => {
    return jsonwebtoken.sign(tokenData, process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: process.env.REFRESH_TOKEN_TTL!,
        ...(options && options)
    });
};

export const getDataFromToken = (jwtToken: string) => {
    try {
        return jsonwebtoken.verify(jwtToken, process.env.JWT_SECRET!);
    } catch (error: any) {
        throw new Error("Unauthorized");
    }
};

export const verifyRefreshToken = (refreshToken: string) => {
    try {
        return jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    } catch (error: any) {
        throw new Error("Invalid refresh token");
    }
};
