import mongoose from "mongoose";

export interface TaskObject {
    _id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    createdAt: Date;
    updatedAt: Date;
    userId: mongoose.Types.ObjectId;
}

export interface TaskCreateObject {
    title: string;
    description: string;
    status?: "pending" | "in-progress" | "completed";
    priority?: "low" | "medium" | "high";
    userId: mongoose.Types.ObjectId;
}

export interface TaskUpdateObject {
    title: string;
    description: string;
    status: string;
    priority: string;
}
