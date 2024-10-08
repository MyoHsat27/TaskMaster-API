import bcryptjs from "bcryptjs";
import { throwError } from "./errorHandler.js";

export const hashPassword = async (password: string): Promise<string> => {
    try {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throwError(error);
    }
};

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcryptjs.compare(password, hashedPassword);
};
