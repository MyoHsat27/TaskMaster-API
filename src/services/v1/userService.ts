import User from "../../models/user.js";
import { UserCreateObject } from "../../types/user.js";

export const userService = () => {
    const findOne = async (param: Record<string, string>) => {
        const user = await User.findOne(param);
        return user;
    };

    const create = (user: UserCreateObject) => {
        const newUser = new User(user);
        const savedUser = newUser.save();

        return savedUser;
    };

    return { findOne, create };
};
