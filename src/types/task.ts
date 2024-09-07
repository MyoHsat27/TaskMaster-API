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
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    isAdmin: boolean;
    _v: number;
}

export interface TaskCreateObject {
    username: string;
    email: string;
    password: string;
}
