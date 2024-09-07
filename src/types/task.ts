import mongoose from "mongoose";

export const enum TaskStatusType {
    PENDING = "income",
    INPROGRESS = "in-progress",
    COMPLETE = "completed"
}

export const enum TaskPriorityType {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}

export interface TaskObject {
    _id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    createdAt: Date;
    updatedAt: Date;
    userId: mongoose.Schema.Types.ObjectId;
}

export interface TaskCreateObject {
    title: string;
    description: string;
    status?: "pending" | "in-progress" | "completed";
    priority?: "low" | "medium" | "high";
    userId: mongoose.Schema.Types.ObjectId;
}

export interface TaskUpdateObject {
    title: string;
    description: string;
    status: string;
    priority: string;
}
