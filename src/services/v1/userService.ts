import User from "../../models/user.js";
import { UserCreateObject } from "../../types/user.js";

export const findOne = async (param: Record<string, string>) => {
    try {
        const user = await User.findOne({
            $or: [{ email: param.email }, { username: param.username }]
        });
        return user;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const create = async (user: UserCreateObject) => {
    try {
        const newUser = new User(user);
        const savedUser = await newUser.save();

        return savedUser;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const updateRefreshToken = async (userId: string, refreshToken: string) => {
    return User.findByIdAndUpdate(userId, {
        refreshToken,
        refreshTokenExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
};
