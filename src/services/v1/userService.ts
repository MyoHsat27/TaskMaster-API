import User from "../../models/user.js";
import { UserCreateObject } from "../../types/user.js";

export const userService = () => {
    const create = (user: UserCreateObject) => {
        const newUser = new User(user);
        const savedUser = newUser.save();

        return savedUser;
    };

    return { create };
};
