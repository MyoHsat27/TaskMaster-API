import mongoose from "mongoose";

export const transformToObjectId = (id: string): mongoose.Schema.Types.ObjectId => {
    try {
        return new mongoose.Schema.Types.ObjectId(id);
    } catch (error: any) {
        throw new Error(error);
    }
};
