import jsonwebtoken from "jsonwebtoken";
import { AuthTokenData, RefreshTokenData } from "../types/token.js";

export const generateAuthToken = (tokenData: AuthTokenData, options?: jsonwebtoken.SignOptions) => {
    try {
        return jsonwebtoken.sign(tokenData, process.env.JWT_SECRET!, {
            expiresIn: process.env.JWT_TTL!,
            ...(options && options)
        });
    } catch {
        throw new Error("Something went wrong");
    }
};

export const generateRefreshToken = (tokenData: RefreshTokenData, options?: jsonwebtoken.SignOptions) => {
    try {
        return jsonwebtoken.sign(tokenData, process.env.REFRESH_TOKEN_SECRET!, {
            expiresIn: process.env.REFRESH_TOKEN_TTL!,
            ...(options && options)
        });
    } catch {
        throw new Error("Something went wrong");
    }
};

export const decodeAuthToken = (jwtToken: string) => {
    try {
        return jsonwebtoken.verify(jwtToken, process.env.JWT_SECRET!) as AuthTokenData;
    } catch {
        throw new Error("Unauthorized");
    }
};

export const decodeRefreshToken = (refreshToken: string): RefreshTokenData => {
    try {
        return jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as RefreshTokenData;
    } catch {
        throw new Error("Invalid refresh token");
    }
};
