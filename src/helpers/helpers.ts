import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { throwError } from "./errorHandler";

export const transformToObjectId = (id: string): mongoose.Types.ObjectId => {
    try {
        return new mongoose.Types.ObjectId(id);
    } catch (error) {
        throwError(error);
    }
};

export const isValidObjectId = (id: string): boolean => {
    return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
};
