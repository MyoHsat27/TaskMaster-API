import mongoose from "mongoose";

export const transformToObjectId = (id: string) => {
    try {
        return new mongoose.Types.ObjectId(id);
    } catch (error: any) {
        throw new Error(error);
    }
};
