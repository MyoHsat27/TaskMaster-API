import bcryptjs from "bcryptjs";

export const hashPassword = async (password: string) => {
    try {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        return hashedPassword;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcryptjs.compare(password, hashedPassword);
};
