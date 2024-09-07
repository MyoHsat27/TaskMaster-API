import Task from "../../models/task.js";
import { TaskCreateObject, TaskUpdateObject } from "../../types/task.js";
import { transformToObjectId } from "../../helpers/mongoHelper.js";

export const getTaskById = async (id: string) => {
    try {
        const taskObjectId = transformToObjectId(id);
        return await Task.findOne({ _id: taskObjectId });
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getTaskByTitle = async (title: string) => {
    try {
        return await Task.findOne({ title });
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getAllTasks = async () => {
    try {
    } catch (error: any) {
        throw new Error(error);
    }
};

export const createTask = async (task: TaskCreateObject) => {
    try {
        const newTask = new Task(task);
        const savedTask = await newTask.save();

        return savedTask;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const updateTask = async (id: string, task: TaskUpdateObject) => {
    try {
        const oldTask = await Task.findById(id);

        oldTask.title = task.title;
        oldTask.description = task.description;
        oldTask.status = task.status;
        oldTask.priority = task.priority;

        const updatedTask = await oldTask.save();
        return updatedTask;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const deleteTask = async (id: string) => {
    try {
        const taskObjectId = transformToObjectId(id);
        await Task.deleteOne({ _id: taskObjectId });
    } catch (error: any) {
        throw new Error(error);
    }
};
