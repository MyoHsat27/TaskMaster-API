import User from "../../models/user.js";
import { UserCreateObject } from "../../types/user.js";
import { transformToObjectId } from "../../helpers/helper.js";

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

export const findOneById = async (id: string) => {
    try {
        let userObjectId = transformToObjectId(id, "wallet not found");
        return await User.findOne({ _id: userObjectId });
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
