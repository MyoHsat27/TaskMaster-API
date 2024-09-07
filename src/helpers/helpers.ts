import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { TaskPriorityType } from "../enums/task";

export const transformToObjectId = (id: string): mongoose.Types.ObjectId => {
    try {
        return new mongoose.Types.ObjectId(id);
    } catch (error: any) {
        throw new Error(error);
    }
};

export const isValidObjectId = (id: string): boolean => {
    return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
};
